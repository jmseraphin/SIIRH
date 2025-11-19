from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db import get_db
from app.models.models import Employee, Absence, Pointage
from app.schemas.paie import PaieExportOut  # ilaina schema

router = APIRouter(tags=["Paie"], prefix="/api/export_paie")

@router.get("/", response_model=list[PaieExportOut])
def export_paie(db: Session = Depends(get_db)):
    employees = db.query(Employee).all()
    result = []
    for emp in employees:
        # Exemple: calcul simple des heures normales et absences
        pointages = db.query(Pointage).filter(Pointage.employee_id == emp.id).all()
        absences_non_payees = db.query(Absence).filter(Absence.employee_id == emp.id, Absence.type_absence == "non_justifiee").count()
        heures_normales = sum(p.duree_heures for p in pointages)
        result.append({
            "employee_id": emp.id,
            "nom": emp.nom,
            "prenom": emp.prenom,
            "heures_normales": heures_normales,
            "heures_supplementaires": 0,  # calcul HS simplifié
            "absences_non_payees": absences_non_payees
        })
    return result
