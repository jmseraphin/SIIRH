from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db import get_db
from app.models import Discipline
from datetime import date

router = APIRouter()

@router.post("/")
def sanction(employee_name: str, date_sanction: date, type_sanction: str, motif: str, db: Session = Depends(get_db)):
    s = Discipline(employee_name=employee_name, date_sanction=date_sanction, type_sanction=type_sanction, motif=motif)
    db.add(s)
    db.commit()
    db.refresh(s)
    return s

@router.get("/")
def list_sanctions(db: Session = Depends(get_db)):
    return db.query(Discipline).all()
