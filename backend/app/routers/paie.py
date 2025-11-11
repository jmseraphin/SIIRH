from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date
from app.db import get_db
from app import models, schemas

router = APIRouter(
    prefix="/paie",
    tags=["Paie"]
)

# ===================== LISTER TOUS LES BULLETINS DE PAIE =====================
@router.get("/", response_model=list[schemas.PaieOut])
def get_all_paie(db: Session = Depends(get_db)):
    paies = db.query(models.Paie).all()
    return paies


# ===================== OBTENIR UN BULLETIN PAR ID =====================
@router.get("/{paie_id}", response_model=schemas.PaieOut)
def get_paie(paie_id: int, db: Session = Depends(get_db)):
    paie = db.query(models.Paie).filter(models.Paie.id == paie_id).first()
    if not paie:
        raise HTTPException(status_code=404, detail="Bulletin de paie non trouvé")
    return paie


# ===================== CRÉER UN BULLETIN DE PAIE =====================
@router.post("/", response_model=schemas.PaieOut)
def create_paie(paie: schemas.PaieCreate, db: Session = Depends(get_db)):
    employe = db.query(models.Employee).filter(models.Employee.id == paie.employee_id).first()
    if not employe:
        raise HTTPException(status_code=404, detail="Employé introuvable")

    # Calcul automatique du salaire net (exemple)
    salaire_net = paie.salaire_base + (paie.prime or 0) - (paie.deduction or 0)

    db_paie = models.Paie(
        employee_id=paie.employee_id,
        date_paie=paie.date_paie or date.today(),
        salaire_base=paie.salaire_base,
        prime=paie.prime,
        deduction=paie.deduction,
        salaire_net=salaire_net,
    )
    db.add(db_paie)
    db.commit()
    db.refresh(db_paie)
    return db_paie


# ===================== METTRE À JOUR UN BULLETIN =====================
@router.put("/{paie_id}", response_model=schemas.PaieOut)
def update_paie(paie_id: int, paie_update: schemas.PaieUpdate, db: Session = Depends(get_db)):
    paie = db.query(models.Paie).filter(models.Paie.id == paie_id).first()
    if not paie:
        raise HTTPException(status_code=404, detail="Bulletin de paie non trouvé")

    for key, value in paie_update.dict(exclude_unset=True).items():
        setattr(paie, key, value)

    db.commit()
    db.refresh(paie)
    return paie


# ===================== SUPPRIMER UN BULLETIN =====================
@router.delete("/{paie_id}")
def delete_paie(paie_id: int, db: Session = Depends(get_db)):
    paie = db.query(models.Paie).filter(models.Paie.id == paie_id).first()
    if not paie:
        raise HTTPException(status_code=404, detail="Bulletin de paie non trouvé")

    db.delete(paie)
    db.commit()
    return {"message": "Bulletin de paie supprimé avec succès"}
