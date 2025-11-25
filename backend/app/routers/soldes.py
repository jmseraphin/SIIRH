# from fastapi import APIRouter, Depends
# from sqlalchemy.orm import Session
# from typing import List
# from app.db import get_db
# from app.models.models import Employee, Absence, Conge
# from app.schemas.soldes import SoldeOut  # ilaina schemas

# router = APIRouter(tags=["Soldes"], prefix="/api/soldes")

# @router.get("/", response_model=List[SoldeOut])
# def list_soldes(db: Session = Depends(get_db)):
#     employees = db.query(Employee).all()
#     result = []
#     for emp in employees:
#         # Calcul simple: total jours de congés pris
#         congés_pris = db.query(Conge).filter(Conge.employee_id == emp.id, Conge.statut == "validée").count()
#         absences_non_payées = db.query(Absence).filter(Absence.employee_id == emp.id, Absence.type_absence == "non_justifiee").count()
#         result.append(
#             {
#                 "employee_id": emp.id,
#                 "nom": emp.nom,
#                 "prenom": emp.prenom,
#                 "conges_pris": congés_pris,
#                 "absences_non_payees": absences_non_payées,
#                 "solde_conges": emp.solde_conges - congés_pris  # exemple simple
#             }
#         )
#     return result















# # FILE: app/routers/soldes.py
# from fastapi import APIRouter, Depends
# from sqlalchemy.orm import Session
# from typing import List
# from app.db import get_db
# from app.models.models import Employee, Absence, Conge
# from app.schemas.soldes import SoldeOut  # ataovy azo antoka fa misy io schemas io

# router = APIRouter(tags=["Soldes"], prefix="/api/soldes")

# def calculate_solde(emp: Employee, db: Session):
#     """
#     Calcul automatique du solde de congés pour un employé
#     et mise à jour si nécessaire.
#     """
#     # Total congés validés pris
#     conges_pris = db.query(Conge).filter(
#         Conge.employee_id == emp.id,
#         Conge.statut == "validée"
#     ).count()

#     # Total absences non payées
#     absences_non_payees = db.query(Absence).filter(
#         Absence.employee_id == emp.id,
#         Absence.type_absence == "non_justifiee"
#     ).count()

#     # Calcul solde restant
#     solde_conges_restant = max(emp.solde_conges - conges_pris, 0)

#     # Mise à jour automatique si le solde a changé
#     if emp.solde_conges != solde_conges_restant:
#         emp.solde_conges = solde_conges_restant
#         db.add(emp)
#         db.commit()

#     return {
#         "employee_id": emp.id,
#         "nom": emp.nom,
#         "prenom": emp.prenom,
#         "conges_pris": conges_pris,
#         "absences_non_payees": absences_non_payees,
#         "solde_conges": solde_conges_restant
#     }

# @router.get("/", response_model=List[SoldeOut])
# def list_soldes(db: Session = Depends(get_db)):
#     """
#     Retourne la liste des soldes de congés pour tous les employés
#     avec calcul automatique à chaque appel.
#     """
#     employees = db.query(Employee).all()
#     result = [calculate_solde(emp, db) for emp in employees]
#     return result








from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.db import get_db
from app.models.models import Employee, Absence, Conge
from app.schemas.soldes import SoldeOut

router = APIRouter(tags=["Soldes"], prefix="/api/soldes")

def calculate_solde(emp: Employee, db: Session):
    # Total congés validés pris
    conges_pris = db.query(Conge).filter(
        Conge.employee_id == emp.id,
        Conge.statut == "validée"
    ).count()

    # Total absences non payées
    absences_non_payees = db.query(Absence).filter(
        Absence.employee_id == emp.id,
        Absence.type_absence == "non_justifiee"
    ).count()

    # Calcul solde restant
    solde_conges_restant = max(emp.solde_conges - conges_pris, 0)

    # Mise à jour automatique si le solde a changé
    if emp.solde_conges != solde_conges_restant:
        emp.solde_conges = solde_conges_restant
        db.add(emp)
        db.commit()

    return {
        "employee_id": emp.id,
        "nom": emp.nom,
        "prenom": emp.prenom,
        "conges_pris": conges_pris,
        "absences_non_payees": absences_non_payees,
        "solde_conges": solde_conges_restant
    }

@router.get("/", response_model=List[SoldeOut])
def list_soldes(db: Session = Depends(get_db)):
    employees = db.query(Employee).all()
    result = [calculate_solde(emp, db) for emp in employees]
    return result
