from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db import get_db
from app.models import Absence
from datetime import date

router = APIRouter()

@router.post("/")
def declare_absence(employee_name: str, date_absence: date, motif: str, db: Session = Depends(get_db)):
    absence = Absence(employee_name=employee_name, date_absence=date_absence, motif=motif)
    db.add(absence)
    db.commit()
    db.refresh(absence)
    return absence

@router.get("/")
def list_absences(db: Session = Depends(get_db)):
    return db.query(Absence).all()
