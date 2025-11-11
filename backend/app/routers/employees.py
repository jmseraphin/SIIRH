# # backend/app/routers/employees.py
# from fastapi import APIRouter, HTTPException, Depends
# from sqlalchemy.orm import Session
# from app.db import get_db
# from app.models import Employee
# from app.schemas import EmployeeCreate, EmployeeUpdate, EmployeeResponse

# router = APIRouter(
#     tags=["employees"]
# )

# # ✅ Create employee
# @router.post("/", response_model=EmployeeResponse)
# def create_employee(employee: EmployeeCreate, db: Session = Depends(get_db)):
#     db_employee = Employee(**employee.dict())
#     db.add(db_employee)
#     db.commit()
#     db.refresh(db_employee)
#     return db_employee

# # ✅ Get all employees
# @router.get("/", response_model=list[EmployeeResponse])
# def get_all_employees(db: Session = Depends(get_db)):
#     return db.query(Employee).all()

# # ✅ Get one employee by ID
# @router.get("/{employee_id}", response_model=EmployeeResponse)
# def get_employee(employee_id: int, db: Session = Depends(get_db)):
#     employee = db.query(Employee).filter(Employee.id == employee_id).first()
#     if not employee:
#         raise HTTPException(status_code=404, detail="Employé non trouvé")
#     return employee

# # ✅ Update employee
# @router.put("/{employee_id}", response_model=EmployeeResponse)
# def update_employee(employee_id: int, updated: EmployeeUpdate, db: Session = Depends(get_db)):
#     employee = db.query(Employee).filter(Employee.id == employee_id).first()
#     if not employee:
#         raise HTTPException(status_code=404, detail="Employé non trouvé")

#     for key, value in updated.dict(exclude_unset=True).items():
#         setattr(employee, key, value)

#     db.commit()
#     db.refresh(employee)
#     return employee

# # ✅ Delete employee
# @router.delete("/{employee_id}")
# def delete_employee(employee_id: int, db: Session = Depends(get_db)):
#     employee = db.query(Employee).filter(Employee.id == employee_id).first()
#     if not employee:
#         raise HTTPException(status_code=404, detail="Employé non trouvé")

#     db.delete(employee)
#     db.commit()
#     return {"message": "Employé supprimé avec succès ✅"}









# # backend/app/routers/employees.py
# from fastapi import APIRouter, HTTPException, Depends
# from sqlalchemy.orm import Session
# from app.db import get_db
# from app.models import Employee, Candidature  # Ataovy azo idirana ny Candidature
# from app.schemas import EmployeeCreate, EmployeeUpdate, EmployeeResponse

# router = APIRouter(
#     tags=["employees"]
# )

# # ✅ Create employee
# @router.post("/", response_model=EmployeeResponse)
# def create_employee(employee: EmployeeCreate, db: Session = Depends(get_db)):
#     db_employee = Employee(**employee.dict())
#     db.add(db_employee)
#     db.commit()
#     db.refresh(db_employee)
#     return db_employee

# # ✅ Get all employees
# @router.get("/", response_model=list[EmployeeResponse])
# def get_all_employees(db: Session = Depends(get_db)):
#     return db.query(Employee).all()

# # ✅ Get one employee by ID
# @router.get("/{employee_id}", response_model=EmployeeResponse)
# def get_employee(employee_id: int, db: Session = Depends(get_db)):
#     employee = db.query(Employee).filter(Employee.id == employee_id).first()
#     if not employee:
#         raise HTTPException(status_code=404, detail="Employé non trouvé")
#     return employee

# # ✅ Update employee
# @router.put("/{employee_id}", response_model=EmployeeResponse)
# def update_employee(employee_id: int, updated: EmployeeUpdate, db: Session = Depends(get_db)):
#     employee = db.query(Employee).filter(Employee.id == employee_id).first()
#     if not employee:
#         raise HTTPException(status_code=404, detail="Employé non trouvé")

#     for key, value in updated.dict(exclude_unset=True).items():
#         setattr(employee, key, value)

#     db.commit()
#     db.refresh(employee)
#     return employee

# # ✅ Delete employee
# @router.delete("/{employee_id}")
# def delete_employee(employee_id: int, db: Session = Depends(get_db)):
#     employee = db.query(Employee).filter(Employee.id == employee_id).first()
#     if not employee:
#         raise HTTPException(status_code=404, detail="Employé non trouvé")

#     db.delete(employee)
#     db.commit()
#     return {"message": "Employé supprimé avec succès ✅"}

# # ------------------ NEW: Create employee from candidature ------------------
# @router.post("/from-candidature/{candidature_id}", response_model=EmployeeResponse)
# def create_employee_from_candidature(candidature_id: int, db: Session = Depends(get_db)):
#     # Retrieve the candidature
#     candidature = db.query(Candidature).filter(Candidature.id == candidature_id).first()
#     if not candidature:
#         raise HTTPException(status_code=404, detail="Candidature non trouvée")

#     # Map fields from candidature to employee
#     new_employee = Employee(
#         nom=candidature.nom,
#         prenom=candidature.prenom,
#         poste=candidature.poste,
#         email=getattr(candidature, "email", None),
#         telephone=getattr(candidature, "telephone", None),
#         # Azonao ampiana fields hafa raha ilaina
#     )

#     db.add(new_employee)
#     db.commit()
#     db.refresh(new_employee)

#     # Optionally, update the candidature status
#     candidature.statut = "Employé"
#     db.commit()

#     return new_employee








# from fastapi import APIRouter, Depends, HTTPException
# from sqlalchemy.orm import Session
# from app.db import get_db
# from app.models.models import Candidature, Employee

# router = APIRouter(
#     prefix="/api/employes",
#     tags=["employes"]
# )

# # ================================
# # Création d'un Employee depuis une Candidature
# # ================================
# @router.post("/from-candidature/{candidature_id}")
# def create_employee_from_candidature(candidature_id: int, db: Session = Depends(get_db)):
#     # 1. Vérifier si la candidature existe
#     candidature = db.query(Candidature).filter(Candidature.id == candidature_id).first()
#     if not candidature:
#         raise HTTPException(status_code=404, detail="Candidature non trouvée")

#     # 2. Vérifier si un Employee existe déjà pour cette candidature
#     if candidature.employee:
#         raise HTTPException(status_code=400, detail="Employee déjà créé pour cette candidature")

#     # 3. Créer le nouvel Employee
#     new_employee = Employee(
#         fullname=candidature.fullname,
#         email=candidature.email,
#         phone=candidature.phone,
#         poste=None,  # poste peut être défini manuellement plus tard
#         candidature_id=candidature.id
#     )

#     # 4. Ajouter à la session et commit
#     db.add(new_employee)
#     db.commit()
#     db.refresh(new_employee)

#     return {
#         "message": "Employee créé avec succès",
#         "employee": {
#             "id": new_employee.id,
#             "fullname": new_employee.fullname,
#             "email": new_employee.email,
#             "phone": new_employee.phone,
#             "candidature_id": new_employee.candidature_id
#         }
#     }


# # ================================
# # Liste de tous les Employees
# # ================================
# @router.get("/")
# def list_employees(db: Session = Depends(get_db)):
#     employees = db.query(Employee).all()
#     return employees










from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.db import get_db
from app.models import Employee, Candidature
from app.schemas import EmployeeCreate, EmployeeUpdate, EmployeeResponse

router = APIRouter(
    prefix="/api/employes",
    tags=["Employés"]
)

# 🧩 GET – Récupérer tous les employés
@router.get("/", response_model=list[EmployeeResponse])
def get_employees(db: Session = Depends(get_db)):
    employees = db.query(Employee).all()
    return employees


# 🧩 GET – Récupérer un employé par ID
@router.get("/{employee_id}", response_model=EmployeeResponse)
def get_employee(employee_id: int, db: Session = Depends(get_db)):
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employé non trouvé")
    return employee


# 🧩 POST – Créer un employé manuellement
@router.post("/", response_model=EmployeeResponse)
def create_employee(employee_data: EmployeeCreate, db: Session = Depends(get_db)):
    new_employee = Employee(**employee_data.dict())
    db.add(new_employee)
    db.commit()
    db.refresh(new_employee)
    return new_employee


# 🧩 PUT – Mettre à jour un employé
@router.put("/{employee_id}", response_model=EmployeeResponse)
def update_employee(employee_id: int, employee_data: EmployeeUpdate, db: Session = Depends(get_db)):
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employé non trouvé")

    for key, value in employee_data.dict(exclude_unset=True).items():
        setattr(employee, key, value)

    db.commit()
    db.refresh(employee)
    return employee


# 🧩 DELETE – Supprimer un employé
@router.delete("/{employee_id}")
def delete_employee(employee_id: int, db: Session = Depends(get_db)):
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employé non trouvé")

    db.delete(employee)
    db.commit()
    return {"message": "Employé supprimé avec succès"}


# 🧩 POST – Créer un employé à partir d’une candidature
@router.post("/from-candidature/{candidature_id}", response_model=EmployeeResponse)
def create_employee_from_candidature(candidature_id: int, db: Session = Depends(get_db)):
    candidature = db.query(Candidature).filter(Candidature.id == candidature_id).first()

    if not candidature:
        raise HTTPException(status_code=404, detail="Candidature non trouvée")

    # ✅ Correction ici : sécuriser fullname (eviter valeur NULL)
    fullname = getattr(candidature, "fullname", None)
    if not fullname:
        nom = getattr(candidature, "nom", "")
        prenom = getattr(candidature, "prenom", "")
        fullname = f"{prenom} {nom}".strip()

    new_employee = Employee(
        fullname=fullname,
        email=getattr(candidature, "email", None),
        phone=getattr(candidature, "phone", None),
        poste=None,
        candidature_id=candidature.id
    )

    db.add(new_employee)
    db.commit()
    db.refresh(new_employee)

    return new_employee
