# backend/app/routers/employees.py
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.db import get_db
from app.models.models import Candidature, Employee

router = APIRouter(tags=["Employees"])

# ==========================================================
# 📌 Créer un Employee depuis une Candidature
# ==========================================================
@router.post("/from-candidature/{candidature_id}")
def create_employee_from_candidature(candidature_id: int, db: Session = Depends(get_db)):
    candidature = db.query(Candidature).filter(Candidature.id == candidature_id).first()
    if not candidature:
        raise HTTPException(status_code=404, detail="Candidature non trouvée")

    if candidature.employee:
        return {"message": "ℹ️ Candidat déjà transformé en Employee", "employee_id": candidature.employee.id}

    new_employee = Employee(
        fullname=candidature.fullname or "Nom Inconnu",
        email=candidature.email or "",
        phone=candidature.phone or "",
        poste=candidature.poste or "",
        candidature_id=candidature.id
    )

    db.add(new_employee)
    db.commit()
    db.refresh(new_employee)

    candidature.statut = "Employé"
    db.commit()

    return {"message": "✅ Candidat ajouté comme Employee !", "employee_id": new_employee.id}

# ==========================================================
# 📋 Liste de tous les Employees
# ==========================================================
@router.get("/")
def list_employees(db: Session = Depends(get_db)):
    employees = db.query(Employee).all()

    result = []
    for e in employees:
        nom, prenom = None, None
        if e.fullname:
            parts = e.fullname.strip().split(" ", 1)
            nom = parts[0]
            prenom = parts[1] if len(parts) > 1 else ""

        result.append({
            "id": e.id,
            "nom": nom or "Inconnu",
            "prenom": prenom or "Inconnu",
            "poste": e.poste if e.poste else "Non défini",
            "email": e.email if e.email else "—",
            "phone": e.phone if e.phone else "Aucune",
            "candidature_id": e.candidature_id
        })

    return result

# ==========================================================
# 📄 Détails d’un Employee
# ==========================================================
@router.get("/{employee_id}")
def get_employee(employee_id: int, db: Session = Depends(get_db)):
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee non trouvé")
    return employee