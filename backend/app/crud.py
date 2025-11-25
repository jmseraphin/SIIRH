# # app/crud.py
# from sqlalchemy.orm import Session
# from app.models import Candidature, Employee, DisciplineCase, Evidence, Event
# from datetime import datetime
# import json
# from . import models


# # -----------------------------
# # CANDIDATURES
# # -----------------------------
# def create_candidature(db: Session, data: dict):
#     db_cand = Candidature(**data)
#     db.add(db_cand)
#     db.commit()
#     db.refresh(db_cand)
#     return db_cand

# def get_all_candidatures(db: Session, status: str = None):
#     query = db.query(Candidature)
#     return query.all()

# # -----------------------------
# # DISCIPLINE
# # -----------------------------
# def create_discipline_case(db: Session, case_data):
#     db_case = DisciplineCase(
#         employee_id=case_data.employee_id,
#         fault_type=case_data.fault_type,
#         description=case_data.description,
#         status="En cours",
#         created_at=datetime.now()
#     )
#     db.add(db_case)
#     db.commit()
#     db.refresh(db_case)
#     return db_case

# def add_evidence(db: Session, case_id: int, file_name: str, file_url: str):
#     db_evidence = Evidence(
#         discipline_case_id=case_id,
#         file_name=file_name,
#         file_url=file_url,
#         created_at=datetime.now()
#     )
#     db.add(db_evidence)
#     db.commit()
#     db.refresh(db_evidence)
#     return db_evidence

# def add_event(db: Session, case_id: int, event_type: str, event_data: dict):
#     """Ajoute un événement disciplinaire (JSON serialisé)."""
#     db_event = Event(
#         discipline_case_id=case_id,
#         event_type=event_type,
#         event_data=json.dumps(event_data),
#         created_at=datetime.now()
#     )
#     db.add(db_event)
#     db.commit()
#     db.refresh(db_event)
#     return db_event

# def list_cases(db: Session):
#     cases = db.query(DisciplineCase).order_by(DisciplineCase.created_at.desc()).all()
#     result = []
#     for c in cases:
#         emp = get_employee(db, c.employee_id)
#         c_dict = c.__dict__.copy()
#         c_dict["employee_name"] = f"{emp.nom} {emp.prenom}" if emp else "Inconnu"
#         result.append(c_dict)
#     return result

# def get_case(db: Session, case_id: int):
#     c = db.query(DisciplineCase).filter(DisciplineCase.id == case_id).first()
#     if not c:
#         return None
#     emp = get_employee(db, c.employee_id)
#     c_dict = c.__dict__.copy()
#     c_dict["employee_name"] = f"{emp.nom} {emp.prenom}" if emp else "Inconnu"
#     return c_dict

# def get_employee(db: Session, employee_id: int):
#     return db.query(Employee).filter(Employee.id == employee_id).first()

# def list_employees(db: Session):
#     return db.query(Employee).all()

# def update_case_status(db: Session, case_id: int, new_status: str):
#     c = db.query(DisciplineCase).filter(DisciplineCase.id == case_id).first()
#     if c:
#         c.status = new_status
#         db.commit()
#         db.refresh(c)
#     return c


# # -----------------------------
# # LAST EVENT
# # -----------------------------
# def get_last_event_of_type(db: Session, case_id: int, event_type: str):
#     """Retourne le dernier Event d’un type donné."""
#     return (
#         db.query(Event)
#         .filter(
#             Event.discipline_case_id == case_id,
#             Event.event_type == event_type
#         )
#         .order_by(Event.created_at.desc())
#         .first()
#     )













# # app/crud.py
# from sqlalchemy.orm import Session
# from app.models import Candidature, Employee, DisciplineCase, Event, DisciplineEvidence
# from datetime import datetime
# import json

# # -----------------------------
# # CANDIDATURES
# # -----------------------------
# def create_candidature(db: Session, data: dict):
#     db_cand = Candidature(**data)
#     db.add(db_cand)
#     db.commit()
#     db.refresh(db_cand)
#     return db_cand

# def get_all_candidatures(db: Session, status: str = None):
#     query = db.query(Candidature)
#     return query.all()

# # -----------------------------
# # DISCIPLINE
# # -----------------------------
# def create_discipline_case(db: Session, case_data):
#     db_case = DisciplineCase(
#         employee_id=case_data.employee_id,
#         fault_type=case_data.fault_type,
#         description=case_data.description,
#         status="En cours",
#         created_at=datetime.now()
#     )
#     db.add(db_case)
#     db.commit()
#     db.refresh(db_case)
#     return db_case

# def add_evidence(db: Session, case_id: int, file_name: str, file_url: str):
#     db_evidence = DisciplineEvidence(
#         discipline_case_id=case_id,
#         file_name=file_name,
#         file_url=file_url,
#         created_at=datetime.now()
#     )
#     db.add(db_evidence)
#     db.commit()
#     db.refresh(db_evidence)
#     return db_evidence

# def add_event(db: Session, case_id: int, event_type: str, event_data: dict):
#     """Ajoute un événement disciplinaire (JSON serialisé)."""
#     db_event = Event(
#         discipline_case_id=case_id,
#         event_type=event_type,
#         event_data=json.dumps(event_data),
#         created_at=datetime.now()
#     )
#     db.add(db_event)
#     db.commit()
#     db.refresh(db_event)
#     return db_event

# def list_cases(db: Session):
#     cases = db.query(DisciplineCase).order_by(DisciplineCase.created_at.desc()).all()
#     result = []
#     for c in cases:
#         emp = get_employee(db, c.employee_id)
#         c_dict = c.__dict__.copy()
#         c_dict["employee_name"] = f"{emp.nom} {emp.prenom}" if emp else "Inconnu"
#         result.append(c_dict)
#     return result

# def get_case(db: Session, case_id: int):
#     c = db.query(DisciplineCase).filter(DisciplineCase.id == case_id).first()
#     if not c:
#         return None
#     emp = get_employee(db, c.employee_id)
#     c_dict = c.__dict__.copy()
#     c_dict["employee_name"] = f"{emp.nom} {emp.prenom}" if emp else "Inconnu"

#     # --- Ajouter le compte_rendu depuis le dernier event de type 'decision' ---
#     last_decision_event = get_last_event_of_type(db, case_id, "decision")
#     if last_decision_event:
#         decision_data = json.loads(last_decision_event.event_data)
#         c_dict["decision"] = {
#             "decision_type": decision_data.get("type", ""),
#             "decision_notes": decision_data.get("notes", "")
#         }
#         c_dict["compte_rendu"] = decision_data.get("notes", "")
#     else:
#         c_dict["decision"] = None
#         c_dict["compte_rendu"] = ""

#     # --- Ajouter les fichiers ---
#     c_dict["files"] = [
#         {"filename": f.file_name, "filepath": f.file_url}
#         for f in get_evidences(db, case_id)
#     ]

#     return c_dict

# def get_employee(db: Session, employee_id: int):
#     return db.query(Employee).filter(Employee.id == employee_id).first()

# def list_employees(db: Session):
#     return db.query(Employee).all()

# def update_case_status(db: Session, case_id: int, new_status: str):
#     c = db.query(DisciplineCase).filter(DisciplineCase.id == case_id).first()
#     if c:
#         c.status = new_status
#         db.commit()
#         db.refresh(c)
#     return c

# # -----------------------------
# # LAST EVENT
# # -----------------------------
# def get_last_event_of_type(db: Session, case_id: int, event_type: str):
#     """Retourne le dernier Event d’un type donné."""
#     return (
#         db.query(Event)
#         .filter(
#             Event.discipline_case_id == case_id,
#             Event.event_type == event_type
#         )
#         .order_by(Event.created_at.desc())
#         .first()
#     )

# def get_evidences(db: Session, case_id: int):
#     return db.query(DisciplineEvidence).filter(DisciplineEvidence.case_id == case_id).all()









# app/crud.py
from sqlalchemy.orm import Session
from app.models import Candidature, Employee, DisciplineCase, Event, DisciplineEvidence
from datetime import datetime
import json

# -----------------------------
# CANDIDATURES
# -----------------------------
def create_candidature(db: Session, data: dict):
    db_cand = Candidature(**data)
    db.add(db_cand)
    db.commit()
    db.refresh(db_cand)
    return db_cand

def get_all_candidatures(db: Session, status: str = None):
    query = db.query(Candidature)
    return query.all()

# -----------------------------
# DISCIPLINE
# -----------------------------
def create_discipline_case(db: Session, case_data):
    db_case = DisciplineCase(
        employee_id=case_data.employee_id,
        fault_type=case_data.fault_type,
        description=case_data.description,
        status="En cours",
        created_at=datetime.now()
    )
    db.add(db_case)
    db.commit()
    db.refresh(db_case)
    return db_case

def add_evidence(db: Session, case_id: int, file_name: str, file_url: str):
    db_evidence = DisciplineEvidence(
        discipline_case_id=case_id,  # ✅ mifanaraka amin'ny models.py
        file_name=file_name,
        file_url=file_url,
        created_at=datetime.now()
    )
    db.add(db_evidence)
    db.commit()
    db.refresh(db_evidence)
    return db_evidence

def add_event(db: Session, case_id: int, event_type: str, event_data: dict):
    """Ajoute un événement disciplinaire (JSON serialisé)."""
    db_event = Event(
        discipline_case_id=case_id,
        event_type=event_type,
        event_data=json.dumps(event_data),
        created_at=datetime.now()
    )
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event

def list_cases(db: Session):
    cases = db.query(DisciplineCase).order_by(DisciplineCase.created_at.desc()).all()
    result = []
    for c in cases:
        emp = get_employee(db, c.employee_id)
        c_dict = c.__dict__.copy()
        c_dict["employee_name"] = f"{emp.nom} {emp.prenom}" if emp else "Inconnu"
        # Ajouter evidences
        c_dict["files"] = [
            {"filename": f.file_name, "filepath": f.file_url}
            for f in get_evidences(db, c.id)
        ]
        # Ajouter dernier decision si exist
        last_decision_event = get_last_event_of_type(db, c.id, "decision")
        if last_decision_event:
            decision_data = json.loads(last_decision_event.event_data)
            c_dict["decision"] = {
                "decision_type": decision_data.get("type", ""),
                "decision_notes": decision_data.get("notes", "")
            }
            c_dict["compte_rendu"] = decision_data.get("notes", "")
        else:
            c_dict["decision"] = None
            c_dict["compte_rendu"] = ""
        result.append(c_dict)
    return result

def get_case(db: Session, case_id: int):
    c = db.query(DisciplineCase).filter(DisciplineCase.id == case_id).first()
    if not c:
        return None
    emp = get_employee(db, c.employee_id)
    c_dict = c.__dict__.copy()
    c_dict["employee_name"] = f"{emp.nom} {emp.prenom}" if emp else "Inconnu"

    # Ajouter evidences
    c_dict["files"] = [
        {"filename": f.file_name, "filepath": f.file_url}
        for f in get_evidences(db, c.id)
    ]

    # Ajouter dernier decision si exist
    last_decision_event = get_last_event_of_type(db, case_id, "decision")
    if last_decision_event:
        decision_data = json.loads(last_decision_event.event_data)
        c_dict["decision"] = {
            "decision_type": decision_data.get("type", ""),
            "decision_notes": decision_data.get("notes", "")
        }
        c_dict["compte_rendu"] = decision_data.get("notes", "")
    else:
        c_dict["decision"] = None
        c_dict["compte_rendu"] = ""

    return c_dict

def get_employee(db: Session, employee_id: int):
    return db.query(Employee).filter(Employee.id == employee_id).first()

def list_employees(db: Session):
    return db.query(Employee).all()

def update_case_status(db: Session, case_id: int, new_status: str):
    c = db.query(DisciplineCase).filter(DisciplineCase.id == case_id).first()
    if c:
        c.status = new_status
        db.commit()
        db.refresh(c)
    return c

# -----------------------------
# LAST EVENT
# -----------------------------
def get_last_event_of_type(db: Session, case_id: int, event_type: str):
    """Retourne le dernier Event d’un type donné."""
    return (
        db.query(Event)
        .filter(
            Event.discipline_case_id == case_id,
            Event.event_type == event_type
        )
        .order_by(Event.created_at.desc())
        .first()
    )

def get_evidences(db: Session, case_id: int):
    return db.query(DisciplineEvidence).filter(DisciplineEvidence.discipline_case_id == case_id).all()
