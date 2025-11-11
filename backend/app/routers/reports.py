from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db import get_db
from app import models
from datetime import date
import io
import pandas as pd
from fastapi.responses import StreamingResponse

router = APIRouter(
    prefix="/reports",
    tags=["Rapports RH"]
)

# ===================== RAPPORT EMPLOYÉS =====================
@router.get("/employes")
def rapport_employes(db: Session = Depends(get_db)):
    employes = db.query(models.Employe).all()
    data = [
        {
            "ID": e.id,
            "Nom": e.nom,
            "Prénom": e.prenom,
            "Email": e.email,
            "Poste": e.poste,
            "Date d’embauche": e.date_embauche,
        }
        for e in employes
    ]
    df = pd.DataFrame(data)
    buffer = io.BytesIO()
    df.to_excel(buffer, index=False)
    buffer.seek(0)
    return StreamingResponse(
        buffer,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": "attachment; filename=rapport_employes.xlsx"}
    )


# ===================== RAPPORT CONTRATS =====================
@router.get("/contrats")
def rapport_contrats(db: Session = Depends(get_db)):
    contrats = db.query(models.Contrat).all()
    data = [
        {
            "ID": c.id,
            "Employé": f"{c.employe.nom} {c.employe.prenom}" if c.employe else "—",
            "Date début": c.date_debut,
            "Date fin": c.date_fin,
            "Salaire": c.salaire,
            "Statut": c.statut,
        }
        for c in contrats
    ]
    df = pd.DataFrame(data)
    buffer = io.BytesIO()
    df.to_excel(buffer, index=False)
    buffer.seek(0)
    return StreamingResponse(
        buffer,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": "attachment; filename=rapport_contrats.xlsx"}
    )


# ===================== RAPPORT PAIE =====================
@router.get("/paie")
def rapport_paie(db: Session = Depends(get_db)):
    paies = db.query(models.Paie).all()
    data = [
        {
            "ID": p.id,
            "Employé": f"{p.employe.nom} {p.employe.prenom}" if p.employe else "—",
            "Date de paie": p.date_paie,
            "Salaire de base": p.salaire_base,
            "Prime": p.prime,
            "Déduction": p.deduction,
            "Salaire net": p.salaire_net,
        }
        for p in paies
    ]
    df = pd.DataFrame(data)
    buffer = io.BytesIO()
    df.to_excel(buffer, index=False)
    buffer.seek(0)
    return StreamingResponse(
        buffer,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": "attachment; filename=rapport_paie.xlsx"}
    )


# ===================== CONTRATS EXPIRÉS =====================
@router.get("/contrats/expirés")
def contrats_expired(db: Session = Depends(get_db)):
    today = date.today()
    contrats = db.query(models.Contrat).filter(models.Contrat.date_fin < today).all()
    if not contrats:
        raise HTTPException(status_code=404, detail="Aucun contrat expiré trouvé")

    data = [
        {
            "Employé": f"{c.employe.nom} {c.employe.prenom}" if c.employe else "—",
            "Date fin": c.date_fin,
            "Salaire": c.salaire,
        }
        for c in contrats
    ]
    return {"contrats_expirés": data}
