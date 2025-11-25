# routers/absences.py
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
from app.db import get_db
from app.models.models import Absence,Employee
from app.schemas.absence import AbsenceCreate, AbsenceUpdate, AbsenceOut

router = APIRouter(
    prefix="/api/absences",
    tags=["Absences"]
)

# 🔹 Liste de toutes les absences
@router.get("/", response_model=List[AbsenceOut])
def list_absences(db: Session = Depends(get_db)):
    return db.query(Absence).all()

# 🔹 Ajouter une absence
@router.post("/", response_model=AbsenceOut)
def create_absence(absence: AbsenceCreate, db: Session = Depends(get_db)):
    employee = db.query(Employee).filter(Employee.id == absence.employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee non trouvé")
    
    new_absence = Absence(
        employee_id=absence.employee_id,
        date_debut=absence.date_debut,   
        date_fin=absence.date_fin,       
        type_absence=absence.type_absence,
        motif=absence.motif,
        statut=absence.statut or "en attente"
    )
    db.add(new_absence)
    db.commit()
    db.refresh(new_absence)
    return new_absence

# 🔹 Modifier une absence
@router.put("/{absence_id}", response_model=AbsenceOut)
def update_absence(absence_id: int, data: AbsenceUpdate, db: Session = Depends(get_db)):
    absence = db.query(Absence).filter(Absence.id == absence_id).first()
    if not absence:
        raise HTTPException(status_code=404, detail="Absence non trouvée")
    
    for field, value in data.dict(exclude_unset=True).items():
        setattr(absence, field, value)
    
    db.commit()
    db.refresh(absence)
    return absence

# 🔹 Supprimer une absence
@router.delete("/{absence_id}")
def delete_absence(absence_id: int, db: Session = Depends(get_db)):
    absence = db.query(Absence).filter(Absence.id == absence_id).first()
    if not absence:
        raise HTTPException(status_code=404, detail="Absence non trouvée")
    
    db.delete(absence)
    db.commit()
    return {"message": "Absence supprimée avec succès"}
