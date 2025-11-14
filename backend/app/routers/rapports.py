# from fastapi import APIRouter, Depends, HTTPException
# from sqlalchemy.orm import Session
# from app.db import get_db
# from app import models
# from datetime import date
# import io
# import pandas as pd
# from fastapi.responses import StreamingResponse

# router = APIRouter(tags=["Rapports RH"])

# # ===================== RAPPORT EMPLOYÉS =====================
# @router.get("/employes")
# def rapport_employes(db: Session = Depends(get_db)):
#     employes = db.query(models.Employe).all()
#     data = [
#         {
#             "ID": e.id,
#             "Nom": e.nom,
#             "Prénom": e.prenom,
#             "Email": e.email,
#             "Poste": e.poste,
#             "Date d’embauche": e.date_embauche,
#         }
#         for e in employes
#     ]
#     df = pd.DataFrame(data)
#     buffer = io.BytesIO()
#     df.to_excel(buffer, index=False)
#     buffer.seek(0)
#     return StreamingResponse(
#         buffer,
#         media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
#         headers={"Content-Disposition": "attachment; filename=rapport_employes.xlsx"}
#     )

# # ===================== RAPPORT CONTRATS =====================
# @router.get("/contrats")
# def rapport_contrats(db: Session = Depends(get_db)):
#     contrats = db.query(models.Contrat).all()
#     data = [
#         {
#             "ID": c.id,
#             "Employé": f"{c.employe.nom} {c.employe.prenom}" if c.employe else "—",
#             "Type": c.type_contrat,
#             "Date début": c.date_debut,
#             "Date fin": c.date_fin,
#             "Salaire": c.salaire,
#             "Statut": c.statut,
#         }
#         for c in contrats
#     ]
#     df = pd.DataFrame(data)
#     buffer = io.BytesIO()
#     df.to_excel(buffer, index=False)
#     buffer.seek(0)
#     return StreamingResponse(
#         buffer,
#         media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
#         headers={"Content-Disposition": "attachment; filename=rapport_contrats.xlsx"}
#     )

# # ===================== RAPPORT PAIE =====================
# @router.get("/paie")
# def rapport_paie(db: Session = Depends(get_db)):
#     paies = db.query(models.Paie).all()
#     data = [
#         {
#             "ID": p.id,
#             "Employé": f"{getattr(c.employe, 'nom', '')} {getattr(c.employe, 'prenom', '')}".strip() or "—",
#             "Date de paie": p.date_paie,
#             "Salaire de base": p.salaire_base,
#             "Prime": p.prime,
#             "Déduction": p.deduction,
#             "Salaire net": p.salaire_net,
#         }
#         for p in paies
#     ]
#     df = pd.DataFrame(data)
#     buffer = io.BytesIO()
#     df.to_excel(buffer, index=False)
#     buffer.seek(0)
#     return StreamingResponse(
#         buffer,
#         media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
#         headers={"Content-Disposition": "attachment; filename=rapport_paie.xlsx"}
#     )

# # ===================== CONTRATS EXPIRÉS =====================
# @router.get("/contrats/expirés")
# def contrats_expired(db: Session = Depends(get_db)):
#     today = date.today()
#     contrats = db.query(models.Contrat).filter(models.Contrat.date_fin < today).all()
#     if not contrats:
#         raise HTTPException(status_code=404, detail="Aucun contrat expiré trouvé")
#     data = [
#         {
#             "Employé": f"{c.employe.nom} {c.employe.prenom}" if c.employe else "—",
#             "Date fin": c.date_fin,
#             "Salaire": c.salaire,
#         }
#         for c in contrats
#     ]
#     return {"contrats_expirés": data}




from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.db import get_db
from app import models
from datetime import date
import io
import pandas as pd
from fastapi.responses import StreamingResponse
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

router = APIRouter(tags=["Rapports RH"])

# ===================== EXPORT EXCEL & PDF HELPERS =====================
def export_excel(data, filename: str):
    df = pd.DataFrame(data)
    buffer = io.BytesIO()
    df.to_excel(buffer, index=False)
    buffer.seek(0)
    return StreamingResponse(
        buffer,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

def export_pdf(data, filename: str):
    buffer = io.BytesIO()
    c = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter
    y = height - 40
    # Header
    if data:
        columns = list(data[0].keys())
        c.setFont("Helvetica-Bold", 10)
        x = 40
        for col in columns:
            c.drawString(x, y, str(col))
            x += 100
        y -= 20
        c.setFont("Helvetica", 9)
        for row in data:
            x = 40
            for col in columns:
                c.drawString(x, y, str(row[col]))
                x += 100
            y -= 20
            if y < 40:
                c.showPage()
                y = height - 40
    c.save()
    buffer.seek(0)
    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

# ===================== RAPPORT EMPLOYÉS =====================
@router.get("/employes")
def rapport_employes(
    db: Session = Depends(get_db),
    fullname: str = Query(None),
    export: str = Query(None)  # "excel" ou "pdf"
):
    query = db.query(models.Employee)
    if fullname:
        query = query.filter(models.Employee.fullname.ilike(f"%{fullname}%"))
    employes = query.all()
    data = [
        {
            "ID": e.id,
            "Nom complet": e.fullname,
            "Email": e.email,
            "Poste": e.poste,
        }
        for e in employes
    ]
    if export == "excel":
        return export_excel(data, "rapport_employes.xlsx")
    elif export == "pdf":
        return export_pdf(data, "rapport_employes.pdf")
    return {"employes": data}


# ===================== RAPPORT CONTRATS =====================
@router.get("/contrats")
def rapport_contrats(
    db: Session = Depends(get_db),
    type_contrat: str = Query(None),
    export: str = Query(None)
):
    query = db.query(models.Contrat)
    if type_contrat:
        query = query.filter(models.Contrat.type_contrat.ilike(f"%{type_contrat}%"))
    contrats = query.all()
    data = [
        {
            "ID": c.id,
            "Employé": c.employee.fullname if c.employee else "—",
            "Type": c.type_contrat,
            "Date début": c.date_debut,
            "Date fin": c.date_fin,
            "Salaire": c.salaire,
        }
        for c in contrats
    ]
    if export == "excel":
        return export_excel(data, "rapport_contrats.xlsx")
    elif export == "pdf":
        return export_pdf(data, "rapport_contrats.pdf")
    return {"contrats": data}

# ===================== CONTRATS EXPIRÉS =====================
@router.get("/contrats/expirés")
def contrats_expired(db: Session = Depends(get_db)):
    today = date.today()
    contrats = db.query(models.Contrat).filter(models.Contrat.date_fin < today).all()
    if not contrats:
        raise HTTPException(status_code=404, detail="Aucun contrat expiré trouvé")
    data = [
        {
            "Employé": c.employee.fullname if c.employee else "—",
            "Date fin": c.date_fin,
            "Salaire": c.salaire,
        }
        for c in contrats
    ]
    return {"contrats_expirés": data}
