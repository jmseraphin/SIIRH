# from fastapi import APIRouter, HTTPException
# from app.db import engine
# import sqlalchemy
# import json
# import traceback
# from app.utils.cv_parser import parse_cv_text  # ✅ fanampiana parsing automatique
# from app.utils.s3_upload import upload_file_to_s3
# import os

# router = APIRouter()

# # 🔹 GET list of candidatures avec score automatique et tri décroissant
# @router.get("/candidatures")
# async def get_candidatures():
#     try:
#         query = sqlalchemy.text("SELECT * FROM candidatures ORDER BY date_candidature DESC")
#         with engine.begin() as conn:
#             result = conn.execute(query)
#             candidatures = []

#             for row in result:
#                 r = dict(row._mapping)
#                 parsed_cv = r.get("parsed_json")
                
#                 # 🔹 Raha mbola tsy misy parsed_json, andramana parse automatique avy amin’ny CV
#                 if not parsed_cv:
#                     texte_cv = None

#                     # 1️⃣ Raha misy raw_cv_s3 (texte brut)
#                     if r.get("raw_cv_s3"):
#                         texte_cv = r["raw_cv_s3"]

#                     # 2️⃣ Raha misy fichier PDF ao amin’ny cv_path
#                     elif r.get("cv_path") and os.path.exists(r["cv_path"]):
#                         try:
#                             from PyPDF2 import PdfReader
#                             reader = PdfReader(r["cv_path"])
#                             texte_cv = " ".join([page.extract_text() for page in reader.pages])
#                         except Exception:
#                             texte_cv = None

#                     # 3️⃣ Raha mbola tsy misy, dia atao 0 ny score
#                     if texte_cv:
#                         try:
#                             parsed_cv = parse_cv_text(texte_cv)
#                             r["parsed_json"] = json.dumps(parsed_cv)
#                         except Exception:
#                             parsed_cv = {}
#                     else:
#                         parsed_cv = {}

#                 else:
#                     if isinstance(parsed_cv, str):
#                         parsed_cv = json.loads(parsed_cv)
                
#                 # 🔹 Calcul automatique du score
#                 score_total, breakdown = calculate_score(parsed_cv)
#                 r["score_total"] = score_total
#                 r["score_breakdown"] = breakdown

#                 # 🔹 Format ISO pour la date
#                 if r.get("date_candidature"):
#                     r["date"] = r["date_candidature"].isoformat()
#                 else:
#                     r["date"] = None

#                 candidatures.append(r)

#             # 🔹 Tri décroissant par score_total
#             candidatures.sort(key=lambda x: x.get("score_total", 0), reverse=True)

#         return candidatures

#     except Exception as e:
#         print(traceback.format_exc())
#         raise HTTPException(status_code=500, detail=f"Erreur: {e}")


# # 🔹 PUT select candidature
# @router.put("/candidatures/{id}/select")
# async def select_candidature(id: int):
#     try:
#         query = sqlalchemy.text("UPDATE candidatures SET statut='Sélectionné' WHERE id=:id")
#         with engine.begin() as conn:
#             res = conn.execute(query, {"id": id})
#             if res.rowcount == 0:
#                 raise HTTPException(status_code=404, detail="Candidature non trouvée")
#         return {"message": "Candidature sélectionnée"}
#     except Exception as e:
#         print(traceback.format_exc())
#         raise HTTPException(status_code=500, detail=f"Erreur: {e}")


# # 🔹 PUT refuse candidature
# @router.put("/candidatures/{id}/refuse")
# async def refuse_candidature(id: int):
#     try:
#         query = sqlalchemy.text("UPDATE candidatures SET statut='Refusé' WHERE id=:id")
#         with engine.begin() as conn:
#             res = conn.execute(query, {"id": id})
#             if res.rowcount == 0:
#                 raise HTTPException(status_code=404, detail="Candidature non trouvée")
#         return {"message": "Candidature refusée"}
#     except Exception as e:
#         print(traceback.format_exc())
#         raise HTTPException(status_code=500, detail=f"Erreur: {e}")


# # 🔹 Fonction de calcul automatique du score (tsy ovaina ny logique fototra)
# def calculate_score(parsed_cv: dict) -> tuple[int, dict]:
#     """
#     Calcul du score total selon le poste et le scoring_config.json
#     """
#     import json

#     try:
#         # 🔹 Chargement dynamique du scoring_config.json
#         config_path = "scoring_config.json"
#         with open(config_path, "r", encoding="utf-8") as f:
#             all_configs = json.load(f)

#         # 🔹 Poste ilaina (défaut: Développeur Python)
#         poste = parsed_cv.get("poste", "Developpeur Python")
#         scoring_config = all_configs.get(poste, all_configs["Developpeur Python"])

#     except Exception:
#         # 🔹 Fallback par défaut raha tsy hita ny fichier
#         scoring_config = {
#             "competences": ["Python", "SQL", "FastAPI"],
#             "experience_min": 3,
#             "diplome_requis": "Master Informatique",
#             "poids": {"competences": 0.4, "experience": 0.3, "formation": 0.2, "projets": 0.1}
#         }

#     # === Calculs ===
#     competences_cv = set(parsed_cv.get("competences", []))
#     match_comp = len(competences_cv & set(scoring_config["competences"])) / max(1, len(scoring_config["competences"]))

#     exp_cv = parsed_cv.get("experience_annees", 0)
#     match_exp = min(exp_cv / scoring_config["experience_min"], 1)

#     formation_cv = parsed_cv.get("diplome", "")
#     match_formation = 1 if formation_cv == scoring_config["diplome_requis"] else 0.5

#     projets_cv = set(parsed_cv.get("projets", []))
#     match_proj = min(len(projets_cv), 3) / 3  # simplifié

#     poids = scoring_config["poids"]
#     score_total = round(
#         (match_comp * poids["competences"] +
#          match_exp * poids["experience"] +
#          match_formation * poids["formation"] +
#          match_proj * poids["projets"]) * 100
#     )

#     breakdown = {
#         "competences": round(match_comp * 100, 2),
#         "experience": round(match_exp * 100, 2),
#         "formation": round(match_formation * 100, 2),
#         "projets": round(match_proj * 100, 2)
#     }

#     return score_total, breakdown



# from fastapi import APIRouter, HTTPException
# from app.db import engine
# import sqlalchemy
# import json
# import traceback
# import os
# from app.utils.cv_parser import parse_cv_text  # ✅ parsing automatique
# from app.utils.s3_upload import upload_file_to_s3

# router = APIRouter()


# # ==========================================================
# # 🔹 GET candidatures (avec parsing et scoring automatique)
# # ==========================================================
# @router.get("/candidatures")
# async def get_candidatures():
#     try:
#         query = sqlalchemy.text("SELECT * FROM candidatures ORDER BY date_candidature DESC")

#         with engine.begin() as conn:
#             result = conn.execute(query)
#             candidatures = []

#             for row in result:
#                 r = dict(row._mapping)
#                 parsed_cv = r.get("parsed_json")

#                 # ---------- PARSING AUTOMATIQUE SI VIDE ----------
#                 if not parsed_cv:
#                     texte_cv = None

#                     # 1️⃣ texte brut
#                     if r.get("raw_cv_s3"):
#                         texte_cv = r["raw_cv_s3"]

#                     # 2️⃣ PDF local
#                     elif r.get("cv_path") and os.path.exists(r["cv_path"]):
#                         try:
#                             from PyPDF2 import PdfReader
#                             reader = PdfReader(r["cv_path"])
#                             texte_cv = " ".join([page.extract_text() or "" for page in reader.pages])
#                         except Exception:
#                             texte_cv = None

#                     # 3️⃣ parsing si texte disponible
#                     if texte_cv:
#                         try:
#                             parsed_cv = parse_cv_text(texte_cv)
#                             r["parsed_json"] = json.dumps(parsed_cv, ensure_ascii=False)
#                         except Exception:
#                             parsed_cv = {}
#                     else:
#                         parsed_cv = {}

#                 else:
#                     # sécurité si c’est une chaîne
#                     if isinstance(parsed_cv, str):
#                         parsed_cv = json.loads(parsed_cv)

#                 # ---------- CALCUL DU SCORE ----------
#                 score_total, breakdown = calculate_score(parsed_cv)
#                 r["score_total"] = score_total
#                 r["score_breakdown"] = breakdown

#                 # ---------- FORMATAGE DE LA DATE ----------
#                 r["date"] = r.get("date_candidature").isoformat() if r.get("date_candidature") else None

#                 candidatures.append(r)

#         # ---------- TRI PAR SCORE DÉCROISSANT ----------
#         candidatures.sort(key=lambda x: x.get("score_total", 0), reverse=True)
#         return candidatures

#     except Exception as e:
#         print(traceback.format_exc())
#         raise HTTPException(status_code=500, detail=f"Erreur interne : {e}")


# # ==========================================================
# # 🔹 PUT sélection de candidature
# # ==========================================================
# @router.put("/candidatures/{id}/select")
# async def select_candidature(id: int):
#     try:
#         query = sqlalchemy.text("UPDATE candidatures SET statut='Sélectionné' WHERE id=:id")
#         with engine.begin() as conn:
#             res = conn.execute(query, {"id": id})
#             if res.rowcount == 0:
#                 raise HTTPException(status_code=404, detail="Candidature non trouvée")
#         return {"message": "Candidature sélectionnée avec succès"}
#     except Exception as e:
#         print(traceback.format_exc())
#         raise HTTPException(status_code=500, detail=f"Erreur : {e}")


# # ==========================================================
# # 🔹 PUT refus de candidature
# # ==========================================================
# @router.put("/candidatures/{id}/refuse")
# async def refuse_candidature(id: int):
#     try:
#         query = sqlalchemy.text("UPDATE candidatures SET statut='Refusé' WHERE id=:id")
#         with engine.begin() as conn:
#             res = conn.execute(query, {"id": id})
#             if res.rowcount == 0:
#                 raise HTTPException(status_code=404, detail="Candidature non trouvée")
#         return {"message": "Candidature refusée avec succès"}
#     except Exception as e:
#         print(traceback.format_exc())
#         raise HTTPException(status_code=500, detail=f"Erreur : {e}")


# # ==========================================================
# # 🔹 Fonction de calcul du score (basée sur scoring_config.json)
# # ==========================================================
# def calculate_score(parsed_cv: dict) -> tuple[int, dict]:
#     try:
#         # Charger le fichier de configuration du scoring
#         with open("scoring_config.json", "r", encoding="utf-8") as f:
#             all_configs = json.load(f)

#         poste = parsed_cv.get("poste", "Developpeur Python")
#         scoring_config = all_configs.get(poste, all_configs["Developpeur Python"])

#     except Exception:
#         # fallback si problème
#         scoring_config = {
#             "competences": ["Python", "SQL", "FastAPI"],
#             "experience_min": 3,
#             "diplome_requis": "Master Informatique",
#             "poids": {"competences": 0.4, "experience": 0.3, "formation": 0.2, "projets": 0.1},
#         }

#     # ======== Évaluation =========
#     competences_cv = set(parsed_cv.get("competences", []))
#     match_comp = len(competences_cv & set(scoring_config["competences"])) / max(1, len(scoring_config["competences"]))

#     exp_cv = parsed_cv.get("experience_annees", 0)
#     match_exp = min(exp_cv / scoring_config["experience_min"], 1)

#     formation_cv = parsed_cv.get("diplome", "")
#     match_formation = 1 if formation_cv == scoring_config["diplome_requis"] else 0.5

#     projets_cv = set(parsed_cv.get("projets", []))
#     match_proj = min(len(projets_cv), 3) / 3

#     poids = scoring_config["poids"]
#     score_total = round(
#         (
#             match_comp * poids["competences"]
#             + match_exp * poids["experience"]
#             + match_formation * poids["formation"]
#             + match_proj * poids["projets"]
#         )
#         * 100
#     )

#     breakdown = {
#         "competences": round(match_comp * 100, 2),
#         "experience": round(match_exp * 100, 2),
#         "formation": round(match_formation * 100, 2),
#         "projets": round(match_proj * 100, 2),
#     }

#     return score_total, breakdown





from fastapi import APIRouter, HTTPException
from app.db import engine
import sqlalchemy
import json
import traceback
import os
from app.utils.cv_parser import parse_cv_text  # ✅ parsing automatique
from app.utils.s3_upload import upload_file_to_s3

router = APIRouter()

# ==========================================================
# 🔹 GET candidatures (avec parsing et scoring automatique)
# ==========================================================
@router.get("/candidatures")
async def get_candidatures():
    try:
        query = sqlalchemy.text("SELECT * FROM candidatures ORDER BY date_candidature DESC")
        with engine.begin() as conn:
            result = conn.execute(query)
            candidatures = []

            for row in result:
                r = dict(row._mapping)
                parsed_cv = r.get("parsed_json")

                # ---------- PARSING AUTOMATIQUE SI VIDE ----------
                if not parsed_cv:
                    texte_cv = None

                    # 1️⃣ texte brut
                    if r.get("raw_cv_s3"):
                        texte_cv = r["raw_cv_s3"]

                    # 2️⃣ PDF local
                    elif r.get("cv_path") and os.path.exists(r["cv_path"]):
                        try:
                            from PyPDF2 import PdfReader
                            reader = PdfReader(r["cv_path"])
                            texte_cv = " ".join([page.extract_text() or "" for page in reader.pages])
                        except Exception:
                            texte_cv = None

                    # 3️⃣ parsing si texte disponible
                    if texte_cv:
                        try:
                            parsed_cv = parse_cv_text(texte_cv)
                            r["parsed_json"] = json.dumps(parsed_cv, ensure_ascii=False)
                        except Exception:
                            parsed_cv = {}
                    else:
                        parsed_cv = {}

                else:
                    # sécurité si c’est une chaîne
                    if isinstance(parsed_cv, str):
                        parsed_cv = json.loads(parsed_cv)

                # ---------- CALCUL DU SCORE ----------
                score_total, breakdown = calculate_score(parsed_cv)
                r["score_total"] = score_total
                r["score_breakdown"] = breakdown

                # ---------- FORMATAGE DE LA DATE ----------
                r["date"] = r.get("date_candidature").isoformat() if r.get("date_candidature") else None

                candidatures.append(r)

        # ---------- TRI PAR SCORE DÉCROISSANT ----------
        candidatures.sort(key=lambda x: x.get("score_total", 0), reverse=True)
        return candidatures

    except Exception as e:
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Erreur interne : {e}")

# ==========================================================
# 🔹 PUT sélection de candidature
# ==========================================================
@router.put("/candidatures/{id}/select")
async def select_candidature(id: int):
    try:
        query = sqlalchemy.text("UPDATE candidatures SET statut='Sélectionné' WHERE id=:id")
        with engine.begin() as conn:
            res = conn.execute(query, {"id": id})
            if res.rowcount == 0:
                raise HTTPException(status_code=404, detail="Candidature non trouvée")
        return {"message": "Candidature sélectionnée avec succès"}
    except Exception as e:
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Erreur : {e}")

# ==========================================================
# 🔹 PUT désélection de candidature
# ==========================================================
@router.put("/candidatures/{id}/deselect")
async def deselect_candidature(id: int):
    try:
        query = sqlalchemy.text("UPDATE candidatures SET statut='Désélectionné' WHERE id=:id")
        with engine.begin() as conn:
            res = conn.execute(query, {"id": id})
            if res.rowcount == 0:
                raise HTTPException(status_code=404, detail="Candidature non trouvée")
        return {"message": "Candidature désélectionnée avec succès"}
    except Exception as e:
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Erreur : {e}")

# ==========================================================
# 🔹 PUT refus de candidature
# ==========================================================
@router.put("/candidatures/{id}/refuse")
async def refuse_candidature(id: int):
    try:
        query = sqlalchemy.text("UPDATE candidatures SET statut='Refusé' WHERE id=:id")
        with engine.begin() as conn:
            res = conn.execute(query, {"id": id})
            if res.rowcount == 0:
                raise HTTPException(status_code=404, detail="Candidature non trouvée")
        return {"message": "Candidature refusée avec succès"}
    except Exception as e:
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Erreur : {e}")

# ==========================================================
# 🔹 POST convocation (Convoqué)
# ==========================================================
@router.post("/candidatures/{id}/send-invitation")
async def send_invitation(id: int):
    try:
        query = sqlalchemy.text("""
            UPDATE candidatures 
            SET statut='Convoqué', date_convocation=NOW(), heure_convocation=NOW() 
            WHERE id=:id
        """)
        with engine.begin() as conn:
            res = conn.execute(query, {"id": id})
            if res.rowcount == 0:
                raise HTTPException(status_code=404, detail="Candidature non trouvée")
        return {"message": "Convocation envoyée avec succès"}
    except Exception as e:
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Erreur : {e}")

# ==========================================================
# 🔹 Fonction de calcul du score (basée sur scoring_config.json)
# ==========================================================
def calculate_score(parsed_cv: dict) -> tuple[int, dict]:
    try:
        # Charger le fichier de configuration du scoring
        with open("scoring_config.json", "r", encoding="utf-8") as f:
            all_configs = json.load(f)

        poste = parsed_cv.get("poste", "Developpeur Python")
        scoring_config = all_configs.get(poste, all_configs["Developpeur Python"])

    except Exception:
        # fallback si problème
        scoring_config = {
            "competences": ["Python", "SQL", "FastAPI"],
            "experience_min": 3,
            "diplome_requis": "Master Informatique",
            "poids": {"competences": 0.4, "experience": 0.3, "formation": 0.2, "projets": 0.1},
        }

    # ======== Évaluation =========
    competences_cv = set(parsed_cv.get("competences", []))
    match_comp = len(competences_cv & set(scoring_config["competences"])) / max(1, len(scoring_config["competences"]))

    exp_cv = parsed_cv.get("experience_annees", 0)
    match_exp = min(exp_cv / scoring_config["experience_min"], 1)

    formation_cv = parsed_cv.get("diplome", "")
    match_formation = 1 if formation_cv == scoring_config["diplome_requis"] else 0.5

    projets_cv = set(parsed_cv.get("projets", []))
    match_proj = min(len(projets_cv), 3) / 3

    poids = scoring_config["poids"]
    score_total = round(
        (
            match_comp * poids["competences"]
            + match_exp * poids["experience"]
            + match_formation * poids["formation"]
            + match_proj * poids["projets"]
        )
        * 100
    )

    breakdown = {
        "competences": round(match_comp * 100, 2),
        "experience": round(match_exp * 100, 2),
        "formation": round(match_formation * 100, 2),
        "projets": round(match_proj * 100, 2),
    }

    return score_total, breakdown
