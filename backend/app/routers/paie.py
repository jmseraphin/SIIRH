from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db import get_db
from app.models.models import Paie, Employee
from app.schemas.paie import PaieCreate, PaieUpdate, PaieOut

router = APIRouter(
    prefix="/api/paies",
    tags=["Paies"]
)

# ✔️ Liste des paies
@router.get("/", response_model=List[PaieOut])
def get_all_paies(db: Session = Depends(get_db)):
    return db.query(Paie).all()

# ✔️ Créer une paie
@router.post("/", response_model=PaieOut)
def create_paie(data: PaieCreate, db: Session = Depends(get_db)):
    employee = db.query(Employee).filter(Employee.id == data.employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee non trouvé")

    paie = Paie(
        montant=data.montant,
        employee_id=data.employee_id
    )
    db.add(paie)
    db.commit()
    db.refresh(paie)
    return paie

# ✔️ Modifier une paie
@router.put("/{paie_id}", response_model=PaieOut)
def update_paie(paie_id: int, data: PaieUpdate, db: Session = Depends(get_db)):
    paie = db.query(Paie).filter(Paie.id == paie_id).first()
    if not paie:
        raise HTTPException(status_code=404, detail="Paie non trouvée")

    for field, value in data.dict(exclude_unset=True).items():
        setattr(paie, field, value)

    db.commit()
    db.refresh(paie)
    return paie

# ✔️ Supprimer une paie
@router.delete("/{paie_id}")
def delete_paie(paie_id: int, db: Session = Depends(get_db)):
    paie = db.query(Paie).filter(Paie.id == paie_id).first()
    if not paie:
        raise HTTPException(status_code=404, detail="Paie non trouvée")

    db.delete(paie)
    db.commit()
    return {"message": "Paie supprimée avec succès"}
