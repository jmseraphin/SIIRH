from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
from app.db import get_db
from app.models.models import Pointage, Employee
from app.schemas.pointage import PointageCreate, PointageUpdate, PointageOut

router = APIRouter(tags=["Pointages"])

@router.get("/", response_model=List[PointageOut])
def list_pointages(db: Session = Depends(get_db)):
    return db.query(Pointage).all()

@router.post("/", response_model=PointageOut)
def create_pointage(pointage: PointageCreate, db: Session = Depends(get_db)):
    employee = db.query(Employee).filter(Employee.id == pointage.employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee non trouvé")
    new_ptg = Pointage(**pointage.dict())
    db.add(new_ptg)
    db.commit()
    db.refresh(new_ptg)
    return new_ptg

@router.put("/{ptg_id}", response_model=PointageOut)
def update_pointage(ptg_id: int, data: PointageUpdate, db: Session = Depends(get_db)):
    ptg = db.query(Pointage).filter(Pointage.id == ptg_id).first()
    if not ptg:
        raise HTTPException(status_code=404, detail="Pointage non trouvé")
    for field, value in data.dict(exclude_unset=True).items():
        setattr(ptg, field, value)
    db.commit()
    db.refresh(ptg)
    return ptg

@router.delete("/{ptg_id}")
def delete_pointage(ptg_id: int, db: Session = Depends(get_db)):
    ptg = db.query(Pointage).filter(Pointage.id == ptg_id).first()
    if not ptg:
        raise HTTPException(status_code=404, detail="Pointage non trouvé")
    db.delete(ptg)
    db.commit()
    return {"message": "Pointage supprimé avec succès"}
