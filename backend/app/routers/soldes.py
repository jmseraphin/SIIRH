from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.db import get_db
from app.models.models import Employee, Absence, Conge
from app.schemas.soldes import SoldeOut  # ilaina schemas

router = APIRouter(tags=["Soldes"], prefix="/api/soldes")

@router.get("/", response_model=List[SoldeOut])
def list_soldes(db: Session = Depends(get_db)):
    employees = db.query(Employee).all()
    result = []
    for emp in employees:
        # Calcul simple: total jours de congés pris
        congés_pris = db.query(Conge).filter(Conge.employee_id == emp.id, Conge.statut == "validée").count()
        absences_non_payées = db.query(Absence).filter(Absence.employee_id == emp.id, Absence.type_absence == "non_justifiee").count()
        result.append(
            {
                "employee_id": emp.id,
                "nom": emp.nom,
                "prenom": emp.prenom,
                "conges_pris": congés_pris,
                "absences_non_payees": absences_non_payées,
                "solde_conges": emp.solde_conges - congés_pris  # exemple simple
            }
        )
    return result
