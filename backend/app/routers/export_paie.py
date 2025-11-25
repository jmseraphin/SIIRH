# from fastapi import APIRouter, Depends
# from sqlalchemy.orm import Session
# from app.db import get_db
# from app.models.models import Employee, Pointage, Absence
# from datetime import datetime

# router = APIRouter(tags=["Paie"], prefix="/api/export_paie")

# @router.get("/")
# def export_paie(db: Session = Depends(get_db)):
#     result = []
#     mois_courant = datetime.now().strftime("%Y-%m")
#     employees = db.query(Employee).all()

#     for emp in employees:
#         try:
#             # Récupération pointages
#             pointages = db.query(Pointage).filter(Pointage.employee_id == emp.id).all()

#             heures_normales = 0
#             heures_supplementaires = 0  # simplifié pour l'instant
#             for p in pointages:
#                 if p.heure_entree and p.heure_sortie:
#                     delta = datetime.combine(datetime.min, p.heure_sortie) - datetime.combine(datetime.min, p.heure_entree)
#                     heures = delta.total_seconds() / 3600
#                     heures_normales += heures

#             # Absences
#             absences_non_payees = db.query(Absence).filter(
#                 Absence.employee_id == emp.id,
#                 Absence.type_absence == "non_justifiee"
#             ).count()

#             # Congés non payés – safe fallback si enum tsy misy
#             try:
#                 conges_non_payes = db.query(Absence).filter(
#                     Absence.employee_id == emp.id,
#                     Absence.type_absence == "conge_non_paye"
#                 ).count()
#             except Exception:
#                 conges_non_payes = 0

#             salaire = getattr(emp, "salaire_base", 0)

#             result.append({
#                 "employee_id": emp.id,
#                 "nom": emp.nom,
#                 "prenom": emp.prenom,
#                 "mois": mois_courant,
#                 "salaire": salaire,
#                 "heures_normales": round(heures_normales, 2),
#                 "heures_supplementaires": round(heures_supplementaires, 2),
#                 "absences_non_payees": absences_non_payees,
#                 "conges_non_payes": conges_non_payes
#             })
#         except Exception as e:
#             print(f"Erreur employé {emp.id}: {e}")
#             continue

#     return result













from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db import get_db
from app.models.models import Employee, Absence, Pointage
from datetime import datetime, timedelta, time

router = APIRouter(tags=["Paie"], prefix="/api/export_paie")

def calcul_heures_normales(pointages):
    total = 0
    for p in pointages:
        if p.heure_entree and p.heure_sortie:
            delta = datetime.combine(datetime.today(), p.heure_sortie) - datetime.combine(datetime.today(), p.heure_entree)
            heures = delta.total_seconds() / 3600
            total += max(0, heures)  # éviter valeurs négatives
    return round(total, 2)

def calcul_heures_sup(pointages):
    total = 0
    for p in pointages:
        if p.heure_entree and p.heure_sortie:
            delta = datetime.combine(datetime.today(), p.heure_sortie) - datetime.combine(datetime.today(), p.heure_entree)
            heures = delta.total_seconds() / 3600
            sup = max(0, heures - 8)  # heures sup = mihoatra 8h/andro
            total += sup
    return round(total, 2)

@router.get("/")
def export_paie(db: Session = Depends(get_db)):
    employees = db.query(Employee).all()
    result = []

    for emp in employees:
        # pointages employé
        pointages = db.query(Pointage).filter(Pointage.employee_id == emp.id).all()
        heures_normales = calcul_heures_normales(pointages)
        heures_supplementaires = calcul_heures_sup(pointages)

        # absences
        absences_non_payees = db.query(Absence).filter(
            Absence.employee_id == emp.id,
            Absence.type_absence == "non_justifiee"
        ).count()

        # congés non payés
        conges_non_payes = db.query(Absence).filter(
            Absence.employee_id == emp.id,
            Absence.type_absence == "conge_non_paye"
        ).count()

        # mois actuel simplifié
        mois = datetime.now().strftime("%Y-%m")

        # salaire fictif / placeholder
        salaire = 1000  # remplacer par calcul réel si il y a table salaire

        result.append({
            "employee_id": emp.id,
            "nom": emp.nom,
            "prenom": emp.prenom,
            "mois": mois,
            "salaire": salaire,
            "heures_normales": heures_normales,
            "heures_supplementaires": heures_supplementaires,
            "absences_non_payees": absences_non_payees,
            "conges_non_payes": conges_non_payes
        })

    return result
