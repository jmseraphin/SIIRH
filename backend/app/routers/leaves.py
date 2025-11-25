# # FILE: app/routers/leaves.py
# from fastapi import APIRouter, Depends, HTTPException
# from sqlalchemy.orm import Session
# from typing import List

# from app.db import get_db
# from app.models.leave import Leave
# from app.models.models import Employee
# from app.schemas.leave import LeaveCreate, LeaveOut, LeaveUpdate

# router = APIRouter(
#     prefix="/api/conges",
#     tags=["Congés"]
# )


# # ================================
# #        GET ALL CONGES
# # ================================
# @router.get("/", response_model=List[LeaveOut])
# def list_conges(db: Session = Depends(get_db)):
#     return db.query(Leave).all()


# # ================================
# #        CREATE CONGE
# # ================================
# @router.post("/", response_model=LeaveOut)
# def create_conge(data: LeaveCreate, db: Session = Depends(get_db)):

#     # Vérifier si l'employé existe
#     emp = db.query(Employee).filter(Employee.id == data.employee_id).first()
#     if not emp:
#         raise HTTPException(404, "Employé introuvable")

#     # Mapping type_conge → type (backend)
#     new_leave = Leave(
#         employee_id=data.employee_id,
#         type=data.type_conge,
#         date_debut=data.date_debut,
#         date_fin=data.date_fin,
#         motif=data.motif,
#         statut="en attente"
#     )

#     db.add(new_leave)
#     db.commit()
#     db.refresh(new_leave)
#     return new_leave


# # ================================
# #        UPDATE CONGE
# # ================================
# @router.put("/{leave_id}", response_model=LeaveOut)
# def update_conge(leave_id: int, data: LeaveUpdate, db: Session = Depends(get_db)):

#     req = db.query(Leave).filter(Leave.id == leave_id).first()
#     if not req:
#         raise HTTPException(404, "Demande introuvable")

#     updates = data.dict(exclude_unset=True)

#     # mapping type_conge → type
#     if "type_conge" in updates:
#         req.type = updates.pop("type_conge")

#     # appliquer les autres champs
#     for field, value in updates.items():
#         setattr(req, field, value)

#     db.commit()
#     db.refresh(req)
#     return req


# # ================================
# #        DELETE CONGE
# # ================================
# @router.delete("/{leave_id}")
# def delete_conge(leave_id: int, db: Session = Depends(get_db)):
#     req = db.query(Leave).filter(Leave.id == leave_id).first()
#     if not req:
#         raise HTTPException(404, "Demande introuvable")

#     db.delete(req)
#     db.commit()
#     return {"message": "Congé supprimé avec succès"}










# FILE: app/routers/leaves.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db import get_db
from app.models.leave import Leave
from app.models.models import Employee
from app.schemas.leave import LeaveCreate, LeaveOut, LeaveUpdate

router = APIRouter(
    prefix="/api/conges",
    tags=["Congés"]
)

def update_solde_conges(emp: Employee, db: Session):
    """
    Calcul et mise à jour automatique du solde de congés pour un employé.
    """
    # Total congés validés pris
    congés_pris = db.query(Leave).filter(
        Leave.employee_id == emp.id,
        Leave.statut == "validée"
    ).count()

    solde_conges_restant = max(emp.solde_conges - congés_pris, 0)
    if emp.solde_conges != solde_conges_restant:
        emp.solde_conges = solde_conges_restant
        db.add(emp)
        db.commit()

    return solde_conges_restant

# ================================
#        GET ALL CONGES
# ================================
@router.get("/", response_model=List[LeaveOut])
def list_conges(db: Session = Depends(get_db)):
    return db.query(Leave).all()


# ================================
#        CREATE CONGE
# ================================
@router.post("/", response_model=LeaveOut)
def create_conge(data: LeaveCreate, db: Session = Depends(get_db)):

    # Vérifier si l'employé existe
    emp = db.query(Employee).filter(Employee.id == data.employee_id).first()
    if not emp:
        raise HTTPException(404, "Employé introuvable")

    # Mapping type_conge → type (backend)
    new_leave = Leave(
        employee_id=data.employee_id,
        type=data.type_conge,
        date_debut=data.date_debut,
        date_fin=data.date_fin,
        motif=data.motif,
        statut="en attente"
    )

    db.add(new_leave)
    db.commit()
    db.refresh(new_leave)
    return new_leave


# ================================
#        UPDATE CONGE
# ================================
@router.put("/{leave_id}", response_model=LeaveOut)
def update_conge(leave_id: int, data: LeaveUpdate, db: Session = Depends(get_db)):

    req = db.query(Leave).filter(Leave.id == leave_id).first()
    if not req:
        raise HTTPException(404, "Demande introuvable")

    updates = data.dict(exclude_unset=True)

    # mapping type_conge → type
    if "type_conge" in updates:
        req.type = updates.pop("type_conge")

    # appliquer les autres champs
    for field, value in updates.items():
        setattr(req, field, value)

    db.commit()
    db.refresh(req)

    # 🔹 Update automatique du solde si le congé est validé
    if req.statut == "validée":
        emp = db.query(Employee).filter(Employee.id == req.employee_id).first()
        if emp:
            update_solde_conges(emp, db)

    return req


# ================================
#        DELETE CONGE
# ================================
@router.delete("/{leave_id}")
def delete_conge(leave_id: int, db: Session = Depends(get_db)):
    req = db.query(Leave).filter(Leave.id == leave_id).first()
    if not req:
        raise HTTPException(404, "Demande introuvable")

    db.delete(req)
    db.commit()

    # 🔹 Update automatique du solde après suppression si congé validé
    if req.statut == "validée":
        emp = db.query(Employee).filter(Employee.id == req.employee_id).first()
        if emp:
            update_solde_conges(emp, db)

    return {"message": "Congé supprimé avec succès"}
