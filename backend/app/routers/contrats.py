# from fastapi import APIRouter, Depends, HTTPException
# from sqlalchemy.orm import Session
# from app.db import get_db
# from app import models, schemas

# router = APIRouter(
#     prefix="/contrats",
#     tags=["Contrats"]
# )

# # ===================== LISTER TOUS LES CONTRATS =====================
# @router.get("/", response_model=list[schemas.ContratOut])
# def get_contrats(db: Session = Depends(get_db)):
#     contrats = db.query(models.Contrat).all()
#     return contrats


# # ===================== OBTENIR CONTRAT PAR ID =====================
# @router.get("/{contrat_id}", response_model=schemas.ContratOut)
# def get_contrat(contrat_id: int, db: Session = Depends(get_db)):
#     contrat = db.query(models.Contrat).filter(models.Contrat.id == contrat_id).first()
#     if not contrat:
#         raise HTTPException(status_code=404, detail="Contrat non trouvé")
#     return contrat


# # ===================== CRÉER UN CONTRAT =====================
# @router.post("/", response_model=schemas.ContratOut)
# def create_contrat(contrat: schemas.ContratCreate, db: Session = Depends(get_db)):
#     employe = db.query(models.Employe).filter(models.Employe.id == contrat.employe_id).first()
#     if not employe:
#         raise HTTPException(status_code=404, detail="Employé introuvable")

#     db_contrat = models.Contrat(**contrat.dict())
#     db.add(db_contrat)
#     db.commit()
#     db.refresh(db_contrat)
#     return db_contrat


# # ===================== METTRE À JOUR UN CONTRAT =====================
# @router.put("/{contrat_id}", response_model=schemas.ContratOut)
# def update_contrat(contrat_id: int, contrat_update: schemas.ContratUpdate, db: Session = Depends(get_db)):
#     contrat = db.query(models.Contrat).filter(models.Contrat.id == contrat_id).first()
#     if not contrat:
#         raise HTTPException(status_code=404, detail="Contrat non trouvé")

#     for key, value in contrat_update.dict(exclude_unset=True).items():
#         setattr(contrat, key, value)

#     db.commit()
#     db.refresh(contrat)
#     return contrat


# # ===================== SUPPRIMER UN CONTRAT =====================
# @router.delete("/{contrat_id}")
# def delete_contrat(contrat_id: int, db: Session = Depends(get_db)):
#     contrat = db.query(models.Contrat).filter(models.Contrat.id == contrat_id).first()
#     if not contrat:
#         raise HTTPException(status_code=404, detail="Contrat non trouvé")

#     db.delete(contrat)
#     db.commit()
#     return {"message": "Contrat supprimé avec succès"}






from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db import get_db
from app import models, schemas

router = APIRouter(
    prefix="/contrats",
    tags=["Contrats"]
)

# ===================== LISTER TOUS LES CONTRATS =====================
@router.get("/", response_model=list[schemas.ContratOut])
def get_contrats(db: Session = Depends(get_db)):
    contrats = db.query(models.Contrat).all()
    return contrats


# ===================== OBTENIR CONTRAT PAR ID =====================
@router.get("/{contrat_id}", response_model=schemas.ContratOut)
def get_contrat(contrat_id: int, db: Session = Depends(get_db)):
    contrat = db.query(models.Contrat).filter(models.Contrat.id == contrat_id).first()
    if not contrat:
        raise HTTPException(status_code=404, detail="Contrat non trouvé")
    return contrat


# ===================== CRÉER UN CONTRAT =====================
@router.post("/", response_model=schemas.ContratOut)
def create_contrat(contrat: schemas.ContratCreate, db: Session = Depends(get_db)):
    employe = db.query(models.Employe).filter(models.Employe.id == contrat.employe_id).first()
    if not employe:
        raise HTTPException(status_code=404, detail="Employé introuvable")

    db_contrat = models.Contrat(**contrat.dict())
    db.add(db_contrat)
    db.commit()
    db.refresh(db_contrat)
    return db_contrat


# ===================== METTRE À JOUR UN CONTRAT =====================
@router.put("/{contrat_id}", response_model=schemas.ContratOut)
def update_contrat(contrat_id: int, contrat_update: schemas.ContratUpdate, db: Session = Depends(get_db)):
    contrat = db.query(models.Contrat).filter(models.Contrat.id == contrat_id).first()
    if not contrat:
        raise HTTPException(status_code=404, detail="Contrat non trouvé")

    for key, value in contrat_update.dict(exclude_unset=True).items():
        setattr(contrat, key, value)

    db.commit()
    db.refresh(contrat)
    return contrat


# ===================== SUPPRIMER UN CONTRAT =====================
@router.delete("/{contrat_id}")
def delete_contrat(contrat_id: int, db: Session = Depends(get_db)):
    contrat = db.query(models.Contrat).filter(models.Contrat.id == contrat_id).first()
    if not contrat:
        raise HTTPException(status_code=404, detail="Contrat non trouvé")

    db.delete(contrat)
    db.commit()
    return {"message": "Contrat supprimé avec succès"}


# ===================== LISTE DES EMPLOYÉS POUR DROPDOWN =====================
@router.get("/employees-for-select")
def employees_for_select(db: Session = Depends(get_db)):
    """
    Endpoint pour fournir la liste des employés existants
    afin de les sélectionner lors de la création d'un contrat.
    """
    employees = db.query(models.Employe).all()
    result = [{"id": e.id, "fullname": e.fullname or "Inconnu"} for e in employees]
    return result
