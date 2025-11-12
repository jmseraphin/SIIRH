# backend/app/routers/contrats.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db import get_db
from app.models.models import Contrat, Employee
from app.schemas import ContratCreate, ContratOut

router = APIRouter(tags=["Contrats"])

# ============================
# 📌 Créer un contrat
# ============================
@router.post("/", response_model=ContratOut)
def create_contrat(contrat: ContratCreate, db: Session = Depends(get_db)):
    """Créer un nouveau contrat pour un employé existant"""
    employee = db.query(Employee).filter(Employee.id == contrat.employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employé non trouvé")

    new_contrat = Contrat(
        employee_id=contrat.employee_id,
        type_contrat=contrat.type_contrat,
        date_debut=contrat.date_debut,
        date_fin=contrat.date_fin,
        salaire=contrat.salaire,
    )
    db.add(new_contrat)
    db.commit()
    db.refresh(new_contrat)
    return new_contrat


# ============================
# 📋 Lister tous les contrats avec nom complet et poste
# ============================
@router.get("/")
def get_contrats(db: Session = Depends(get_db)):
    """Récupérer tous les contrats avec le nom complet et le poste de l'employé"""
    contrats = (
        db.query(Contrat, Employee.fullname, Employee.poste)
        .join(Employee, Contrat.employee_id == Employee.id)
        .all()
    )

    result = []
    for contrat, fullname, poste in contrats:
        result.append({
            "id": contrat.id,
            "employee_id": contrat.employee_id,
            "type_contrat": contrat.type_contrat,
            "date_debut": contrat.date_debut,
            "date_fin": contrat.date_fin,
            "salaire": contrat.salaire,
            "nom_complet": fullname if fullname and fullname.strip() != "" else "Inconnu",
            "poste": poste if poste and poste.strip() != "" else "Non défini"
        })
    return result
