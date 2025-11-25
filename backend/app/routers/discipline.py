# from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
# from sqlalchemy.orm import Session
# from typing import List
# from datetime import datetime
# import os
# from app.schemas.employees import Employee  
# from app import crud, schemas
# from app.db import get_db
# from app.utils.pdf_generator import generate_convocation_pdf, generate_decision_pdf, generate_licenciement_letter

# router = APIRouter(prefix="/discipline", tags=["Discipline"])

# # 1. Créer un dossier disciplinaire avec fichiers
# @router.post("/cases", response_model=schemas.DisciplineCase)
# async def create_case(
#     employee_id: int = Form(...),
#     fault_type: str = Form(...),
#     description: str = Form(None),
#     files: List[UploadFile] = File([]),
#     db: Session = Depends(get_db)
# ):
#     employee = crud.get_employee(db, employee_id)
#     if not employee:
#         raise HTTPException(status_code=404, detail="Employé non trouvé")

#     case_data = schemas.DisciplineCaseCreate(
#         employee_id=employee_id,
#         fault_type=fault_type,
#         description=description
#     )
#     db_case = crud.create_discipline_case(db, case_data)

#     for f in files:
#         temp_dir = "/tmp/discipline_files"
#         os.makedirs(temp_dir, exist_ok=True)
#         file_path = os.path.join(temp_dir, f.filename)
#         content = await f.read()
#         with open(file_path, "wb") as file_object:
#             file_object.write(content)
#         crud.add_evidence(db, db_case.id, f.filename, file_path)

#     case_dict = crud.get_case(db, db_case.id)
#     return case_dict

# # 2. Lister tous les dossiers
# @router.get("/cases", response_model=List[schemas.DisciplineCase])
# def list_cases(db: Session = Depends(get_db)):
#     return crud.list_cases(db)

# # 3. Détails d'un dossier
# @router.get("/cases/{case_id}", response_model=schemas.DisciplineCase)
# def get_case(case_id: int, db: Session = Depends(get_db)):
#     db_case = crud.get_case(db, case_id)
#     if not db_case:
#         raise HTTPException(status_code=404, detail="Case not found")
#     return db_case

# # 4. Convocation PDF
# @router.post("/cases/{case_id}/convocation")
# def create_convocation(case_id: int, db: Session = Depends(get_db)):
#     db_case = crud.get_case(db, case_id)
#     if not db_case:
#         raise HTTPException(status_code=404, detail="Case not found")
#     pdf_path = generate_convocation_pdf(db_case["employee_id"], {
#         "date_entretien": datetime.now().strftime("%d/%m/%Y"),
#         "heure_entretien": "09:00",
#         "lieu_entretien": "Bureau RH"
#     })
#     crud.add_event(db, case_id, "convocation", {"pdf": pdf_path})
#     return {"pdf_url": pdf_path}

# # 5. Décision PDF
# @router.post("/cases/{case_id}/decision")
# def create_decision(case_id: int, decision: schemas.Decision, db: Session = Depends(get_db)):
#     db_case = crud.get_case(db, case_id)
#     if not db_case:
#         raise HTTPException(status_code=404, detail="Case not found")
#     pdf_path = generate_decision_pdf(db_case["employee_id"], decision)
#     crud.add_event(db, case_id, "decision", {
#         "type": decision.decision_type,
#         "notes": decision.decision_notes,
#         "pdf": pdf_path
#     })
#     return {"pdf_url": pdf_path}

# # 6. Lettre licenciement PDF
# @router.post("/cases/{case_id}/generate-letter")
# def generate_licence_letter(case_id: int, db: Session = Depends(get_db)):
#     db_case = crud.get_case(db, case_id)
#     if not db_case:
#         raise HTTPException(status_code=404, detail="Case not found")
#     if db_case["fault_type"] != "Licenciement":
#         raise HTTPException(status_code=400, detail="Non applicable")
#     pdf_path = generate_licenciement_letter(db_case["employee_id"], None)
#     crud.add_event(db, case_id, "lettre_licenciement", {"pdf": pdf_path})
#     return {"pdf_url": pdf_path}

# # 7. Liste des employés (pour autocomplete)
# @router.get("/employees", response_model=List[Employee])
# def list_employees(db: Session = Depends(get_db)):
#     db_employees = crud.list_employees(db)
#     return [
#         Employee(
#             id=e.id,
#             nom=e.nom,
#             prenom=e.prenom,
#             fullname=f"{e.nom} {e.prenom}",
#             email=e.email,
#             poste=e.poste
#         ) for e in db_employees
#     ]












# from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
# from sqlalchemy.orm import Session
# from typing import List
# from datetime import datetime
# import os
# from app.schemas.employees import Employee  
# from app import crud, schemas
# from app.db import get_db
# from app.utils.pdf_generator import generate_convocation_pdf, generate_decision_pdf, generate_licenciement_letter

# router = APIRouter(prefix="/discipline", tags=["Discipline"])

# # 1. Créer un dossier disciplinaire avec fichiers
# @router.post("/cases", response_model=schemas.DisciplineCase)
# async def create_case(
#     employee_id: int = Form(...),
#     fault_type: str = Form(...),
#     description: str = Form(None),
#     files: List[UploadFile] = File([]),
#     db: Session = Depends(get_db)
# ):
#     employee = crud.get_employee(db, employee_id)
#     if not employee:
#         raise HTTPException(status_code=404, detail="Employé non trouvé")

#     case_data = schemas.DisciplineCaseCreate(
#         employee_id=employee_id,
#         fault_type=fault_type,
#         description=description
#     )
#     db_case = crud.create_discipline_case(db, case_data)

#     for f in files:
#         temp_dir = "/tmp/discipline_files"
#         os.makedirs(temp_dir, exist_ok=True)
#         file_path = os.path.join(temp_dir, f.filename)
#         content = await f.read()
#         with open(file_path, "wb") as file_object:
#             file_object.write(content)
#         crud.add_evidence(db, db_case.id, f.filename, file_path)

#     case_dict = crud.get_case(db, db_case.id)
#     return case_dict

# # 2. Lister tous les dossiers
# @router.get("/cases", response_model=List[schemas.DisciplineCase])
# def list_cases(db: Session = Depends(get_db)):
#     return crud.list_cases(db)

# # 3. Détails d'un dossier
# @router.get("/cases/{case_id}", response_model=schemas.DisciplineCase)
# def get_case(case_id: int, db: Session = Depends(get_db)):
#     db_case = crud.get_case(db, case_id)
#     if not db_case:
#         raise HTTPException(status_code=404, detail="Case not found")
#     return db_case

# # 4. Convocation PDF
# @router.post("/cases/{case_id}/convocation")
# def create_convocation(case_id: int, db: Session = Depends(get_db)):
#     db_case = crud.get_case(db, case_id)
#     if not db_case:
#         raise HTTPException(status_code=404, detail="Case not found")
#     pdf_path = generate_convocation_pdf(db_case["employee_id"], {
#         "date_entretien": datetime.now().strftime("%d/%m/%Y"),
#         "heure_entretien": "09:00",
#         "lieu_entretien": "Bureau RH"
#     })
#     crud.add_event(db, case_id, "convocation", {"pdf": pdf_path})
#     return {"pdf_url": pdf_path}

# # 5. Décision PDF
# @router.post("/cases/{case_id}/decision")
# def create_decision(case_id: int, decision: schemas.Decision, db: Session = Depends(get_db)):
#     db_case = crud.get_case(db, case_id)
#     if not db_case:
#         raise HTTPException(status_code=404, detail="Case not found")
#     pdf_path = generate_decision_pdf(db_case["employee_id"], decision)
#     crud.add_event(db, case_id, "decision", {
#         "type": decision.decision_type,
#         "notes": decision.decision_notes,
#         "pdf": pdf_path
#     })
#     return {"pdf_url": pdf_path}

# # 6. Lettre licenciement PDF
# @router.post("/cases/{case_id}/generate-letter")
# def generate_licence_letter(case_id: int, db: Session = Depends(get_db)):
#     db_case = crud.get_case(db, case_id)
#     if not db_case:
#         raise HTTPException(status_code=404, detail="Case not found")
#     if db_case["fault_type"] != "Licenciement":
#         raise HTTPException(status_code=400, detail="Non applicable")
#     pdf_path = generate_licenciement_letter(db_case["employee_id"], None)
#     crud.add_event(db, case_id, "lettre_licenciement", {"pdf": pdf_path})
#     return {"pdf_url": pdf_path}

# # 7. Liste des employés (pour autocomplete)
# @router.get("/employees", response_model=List[Employee])
# def list_employees(db: Session = Depends(get_db)):
#     db_employees = crud.list_employees(db)
#     return [
#         Employee(
#             id=e.id,
#             nom=e.nom,
#             prenom=e.prenom,
#             fullname=f"{e.nom} {e.prenom}",
#             email=e.email,
#             poste=e.poste
#         ) for e in db_employees
#     ]

# @router.post("/cases/{case_id}/convocation")
# def create_convocation(case_id: int, db: Session = Depends(get_db)):
#     db_case = crud.get_case(db, case_id)
#     if not db_case:
#         raise HTTPException(status_code=404, detail="Case not found")
    
#     employee = crud.get_employee(db, db_case["employee_id"])
#     if not employee:
#         raise HTTPException(status_code=404, detail="Employee not found")
    
#     # PDF
#     pdf_path = generate_convocation_pdf(employee, {
#         "date_entretien": datetime.now().strftime("%d/%m/%Y"),
#         "heure_entretien": "09:00",
#         "lieu_entretien": "Bureau RH"
#     })
    
#     # Add event (dict ho JSON automatically)
#     crud.add_event(db, case_id, "convocation", {"pdf": pdf_path})
    
#     return {"pdf_url": pdf_path}





# from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
# from sqlalchemy.orm import Session
# from typing import List
# from datetime import datetime
# import os
# from fastapi.responses import FileResponse
# from app.schemas.employees import Employee  
# from app import crud, schemas
# from app.db import get_db
# from app.utils.pdf_generator import generate_convocation_pdf, generate_decision_pdf, generate_licenciement_letter

# router = APIRouter(prefix="/discipline", tags=["Discipline"])

# # 1. Créer un dossier disciplinaire avec fichiers
# @router.post("/cases", response_model=schemas.DisciplineCase)
# async def create_case(
#     employee_id: int = Form(...),
#     fault_type: str = Form(...),
#     description: str = Form(None),
#     files: List[UploadFile] = File([]),
#     db: Session = Depends(get_db)
# ):
#     employee = crud.get_employee(db, employee_id)
#     if not employee:
#         raise HTTPException(status_code=404, detail="Employé non trouvé")

#     case_data = schemas.DisciplineCaseCreate(
#         employee_id=employee_id,
#         fault_type=fault_type,
#         description=description
#     )
#     db_case = crud.create_discipline_case(db, case_data)

#     for f in files:
#         temp_dir = "/tmp/discipline_files"
#         os.makedirs(temp_dir, exist_ok=True)
#         file_path = os.path.join(temp_dir, f.filename)
#         content = await f.read()
#         with open(file_path, "wb") as file_object:
#             file_object.write(content)
#         crud.add_evidence(db, db_case.id, f.filename, file_path)

#     case_dict = crud.get_case(db, db_case.id)
#     return case_dict

# # 2. Lister tous les dossiers
# @router.get("/cases", response_model=List[schemas.DisciplineCase])
# def list_cases(db: Session = Depends(get_db)):
#     return crud.list_cases(db)

# # 3. Détails d'un dossier
# @router.get("/cases/{case_id}", response_model=schemas.DisciplineCase)
# def get_case(case_id: int, db: Session = Depends(get_db)):
#     db_case = crud.get_case(db, case_id)
#     if not db_case:
#         raise HTTPException(status_code=404, detail="Case not found")
#     return db_case

# # 4. Convocation PDF
# @router.post("/cases/{case_id}/convocation")
# def create_convocation(case_id: int, db: Session = Depends(get_db)):
#     db_case = crud.get_case(db, case_id)
#     if not db_case:
#         raise HTTPException(status_code=404, detail="Case not found")
    
#     employee = crud.get_employee(db, db_case["employee_id"])
#     if not employee:
#         raise HTTPException(status_code=404, detail="Employee not found")
    
#     pdf_path = generate_convocation_pdf(employee, {
#         "date_entretien": datetime.now().strftime("%d/%m/%Y"),
#         "heure_entretien": "09:00",
#         "lieu_entretien": "Bureau RH"
#     })
#     crud.add_event(db, case_id, "convocation", {"pdf": pdf_path})
#     return {"pdf_url": pdf_path}

# # 5. Décision PDF et mise à jour du status
# @router.post("/cases/{case_id}/decision")
# def create_decision(case_id: int, decision: schemas.Decision, db: Session = Depends(get_db)):
#     db_case = crud.get_case(db, case_id)
#     if not db_case:
#         raise HTTPException(status_code=404, detail="Case not found")
    
#     employee = crud.get_employee(db, db_case["employee_id"])
#     if not employee:
#         raise HTTPException(status_code=404, detail="Employee not found")
        
    
#     # Générer PDF de décision
#     pdf_path = generate_decision_pdf(employee, decision)
    
#     # Ajouter l'événement
#     crud.add_event(db, case_id, "decision", {
#         "type": decision.decision_type,
#         "notes": decision.decision_notes,
#         "pdf": pdf_path
#     })

#     # --- Mise à jour du status du dossier selon la décision ---
#     new_status = decision.decision_type  # Ex: "Avertissement", "Mise à pied", "Licenciement"
#     crud.update_case_status(db, case_id, new_status)

#     # Si licenciement, générer lettre
#     if decision.decision_type == "Licenciement":
#         pdf_letter_path = generate_licenciement_letter(employee, None)
#         crud.add_event(db, case_id, "lettre_licenciement", {"pdf": pdf_letter_path})

#     return {"pdf_url": pdf_path}

# # 6. Lettre licenciement PDF (route séparée si besoin)
# @router.post("/cases/{case_id}/generate-letter")
# def generate_licence_letter(case_id: int, db: Session = Depends(get_db)):
#     db_case = crud.get_case(db, case_id)
#     if not db_case:
#         raise HTTPException(status_code=404, detail="Case not found")
#     if db_case["fault_type"] != "Licenciement":
#         raise HTTPException(status_code=400, detail="Non applicable")
    
#     employee = crud.get_employee(db, db_case["employee_id"])
#     if not employee:
#         raise HTTPException(status_code=404, detail="Employee not found")
    
#     pdf_path = generate_licenciement_letter(employee, None)
#     crud.add_event(db, case_id, "lettre_licenciement", {"pdf": pdf_path})
#     return FileResponse(
#         pdf_path,
#         media_type="application/pdf",
#         filename=f"convocation_{employee.id}.pdf"
#     )

# # 7. Liste des employés (pour autocomplete)
# @router.get("/employees", response_model=List[Employee])
# def list_employees(db: Session = Depends(get_db)):
#     db_employees = crud.list_employees(db)
#     return [
#         Employee(
#             id=e.id,
#             nom=e.nom,
#             prenom=e.prenom,
#             fullname=f"{e.nom} {e.prenom}",
#             email=e.email,
#             poste=e.poste
#         ) for e in db_employees
#     ]












from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
import json
import os
from fastapi.responses import FileResponse

from app.schemas.employees import Employee  
from app import crud, schemas
from app.db import get_db
from app.utils.pdf_generator import (
    generate_convocation_pdf,
    generate_decision_pdf,
    generate_licenciement_letter
)
from app.utils.mailer import send_mail

router = APIRouter(prefix="/discipline", tags=["Discipline"])

# ==========================================================
# 1. CREER DOSSIER
# ==========================================================
@router.post("/cases", response_model=schemas.DisciplineCase)
async def create_case(
    employee_id: int = Form(...),
    fault_type: str = Form(...),
    description: str = Form(None),
    files: List[UploadFile] = File([]),
    db: Session = Depends(get_db)
):
    emp = crud.get_employee(db, employee_id)
    if not emp:
        raise HTTPException(status_code=404, detail="Employé non trouvé")

    case_data = schemas.DisciplineCaseCreate(
        employee_id=employee_id,
        fault_type=fault_type,
        description=description
    )
    db_case = crud.create_discipline_case(db, case_data)

    # Save files
    temp_dir = "/tmp/discipline_files"
    os.makedirs(temp_dir, exist_ok=True)

    for f in files:
        file_path = os.path.join(temp_dir, f.filename)
        with open(file_path, "wb") as buffer:
            buffer.write(await f.read())

        crud.add_evidence(db, db_case.id, f.filename, file_path)

    return crud.get_case(db, db_case.id)

# ==========================================================
# 2. LISTE DES DOSSIERS
# ==========================================================
@router.get("/cases", response_model=List[schemas.DisciplineCase])
def list_cases(db: Session = Depends(get_db)):
    return crud.list_cases(db)

# ==========================================================
# 3. DETAILS
# ==========================================================
@router.get("/cases/{case_id}", response_model=schemas.DisciplineCase)
def get_case(case_id: int, db: Session = Depends(get_db)):
    case = crud.get_case(db, case_id)
    if not case:
        raise HTTPException(status_code=404, detail="Case non trouvé")

    # --- Ajouter le compte_rendu depuis le dernier event de type 'decision' ---
    last_decision_event = crud.get_last_event_of_type(db, case_id, "decision")
    if last_decision_event:
        decision_data = json.loads(last_decision_event.event_data)
        case["decision"] = {
            "decision_type": decision_data.get("type", ""),
            "decision_notes": decision_data.get("notes", "")
        }
        case["compte_rendu"] = decision_data.get("notes", "")
    else:
        case["decision"] = None
        case["compte_rendu"] = ""
        
    # --- Ajouter les fichiers ---
    case["files"] = [
        {"filename": f.file_name, "filepath": f.file_url}
        for f in crud.get_evidences(db, case_id)
    ]

    return case

# ==========================================================
# 4. PDF CONVOCATION
# ==========================================================
@router.post("/cases/{case_id}/convocation")
def create_convocation(case_id: int, db: Session = Depends(get_db)):
    case = crud.get_case(db, case_id)
    if not case:
        raise HTTPException(status_code=404, detail="Case non trouvé")

    emp = crud.get_employee(db, case["employee_id"])
    if not emp:
        raise HTTPException(status_code=404, detail="Employé non trouvé")

    # Generate PDF
    pdf_path = generate_convocation_pdf(
        emp,
        {
            "date_entretien": datetime.now().strftime("%d/%m/%Y"),
            "heure_entretien": "09:00",
            "lieu_entretien": "Bureau RH"
        }
    )

    crud.add_event(db, case_id, "convocation", {"pdf": pdf_path})

    return FileResponse(pdf_path, media_type="application/pdf")

# ==========================================================
# 5. DECISION PDF
# ==========================================================
@router.post("/cases/{case_id}/decision")
def create_decision(case_id: int, decision: schemas.Decision, db: Session = Depends(get_db)):

    case = crud.get_case(db, case_id)
    if not case:
        raise HTTPException(status_code=404, detail="Case non trouvé")

    emp = crud.get_employee(db, case["employee_id"])

    pdf_path = generate_decision_pdf(emp, decision)

    crud.add_event(db, case_id, "decision", {
        "type": decision.decision_type,
        "notes": decision.decision_notes,
        "pdf": pdf_path
    })

    crud.update_case_status(db, case_id, decision.decision_type)

    if decision.decision_type == "Licenciement":
        lettre_path = generate_licenciement_letter(emp, None)
        crud.add_event(db, case_id, "lettre_licenciement", {"pdf": lettre_path})

    return FileResponse(pdf_path, media_type="application/pdf")

# ==========================================================
# 6. ENVOI MAIL CONVOCATION
# ==========================================================
@router.post("/cases/{case_id}/send-convocation-mail")
def send_convocation_email(case_id: int, db: Session = Depends(get_db)):

    case = crud.get_case(db, case_id)
    if not case:
        raise HTTPException(status_code=404, detail="Case non trouvé")

    emp = crud.get_employee(db, case["employee_id"])

    event = crud.get_last_event_of_type(db, case_id, "convocation")
    if not event:
        raise HTTPException(status_code=400, detail="Aucune convocation générée")

    data = json.loads(event.event_data)
    pdf_path = data["pdf"]

    send_mail(
        to=emp.email,
        subject="Convocation entretien disciplinaire",
        body=f"Bonjour {emp.nom},\nVeuillez trouver ci-joint votre convocation.",
        attachments=[pdf_path]
    )

    return {"message": "Email envoyé", "pdf": pdf_path}

# ==========================================================
# 7. LISTE EMPLOYES
# ==========================================================
@router.get("/employees", response_model=List[Employee])
def list_employees(db: Session = Depends(get_db)):
    employees = crud.list_employees(db)
    return [
        Employee(
            id=e.id,
            nom=e.nom,
            prenom=e.prenom,
            fullname=f"{e.nom} {e.prenom}",
            email=e.email,
            poste=e.poste
        )
        for e in employees
    ]
# ==========================================================
# 4b. PDF CONVOCATION DISCIPLINE (NOUVEAU)
# ==========================================================
from fastapi import Body  # ampio ao amin'ny imports

@router.post("/cases/{case_id}/convocation-discipline")
def create_convocation_discipline(
    case_id: int,
    convocation: dict = Body(...),  # mandray date sy heure avy amin'ny frontend
    db: Session = Depends(get_db)
):
    case = crud.get_case(db, case_id)
    if not case:
        raise HTTPException(status_code=404, detail="Case non trouvé")

    emp = crud.get_employee(db, case["employee_id"])
    if not emp:
        raise HTTPException(status_code=404, detail="Employé non trouvé")

    # Générer PDF discipline mifanaraka amin'ny type de faute
    convocation_data = {
        "fault_type": case["fault_type"],
        "date_convocation": convocation.get("date_convocation", "à définir"),
        "heure_convocation": convocation.get("heure_convocation", "à définir"),
        "lieu_convocation": "Bureau RH"
    }

    from app.utils.pdf_generator import generate_convocation_discipline_pdf
    pdf_path = generate_convocation_discipline_pdf(emp, convocation_data)

    crud.add_event(db, case_id, "convocation_discipline", {"pdf": pdf_path})

    return FileResponse(pdf_path, media_type="application/pdf")


# ==========================================================
# ENVOI MAIL CONVOCATION DISCIPLINE
# ==========================================================
@router.post("/cases/{case_id}/send-convocation-discipline-mail")
def send_convocation_discipline_email(
    case_id: int,
    convocation: dict = Body(...),  # mandray date sy heure avy amin'ny frontend
    db: Session = Depends(get_db)
):

    case = crud.get_case(db, case_id)
    if not case:
        raise HTTPException(status_code=404, detail="Case non trouvé")

    emp = crud.get_employee(db, case["employee_id"])
    if not emp:
        raise HTTPException(status_code=404, detail="Employé non trouvé")

    # Générer PDF discipline
    from app.utils.pdf_generator import generate_convocation_discipline_pdf
    convocation_data = {
        "fault_type": case["fault_type"],
        "date_convocation": convocation.get("date_convocation", "à définir"),
        "heure_convocation": convocation.get("heure_convocation", "à définir"),
        "lieu_convocation": "Bureau RH"
    }
    pdf_path = generate_convocation_discipline_pdf(emp, convocation_data)

    # Ajouter événement
    crud.add_event(db, case_id, "convocation_discipline", {"pdf": pdf_path})

    # Envoyer mail
    send_mail(
        to=emp.email,
        subject="Convocation disciplinaire",
        body=f"Bonjour {emp.nom},\nVeuillez trouver ci-joint votre convocation disciplinaire.\n\nDate : {convocation_data['date_convocation']}\nHeure : {convocation_data['heure_convocation']}\nLieu : {convocation_data['lieu_convocation']}",
        attachments=[pdf_path]
    )

    return {"message": "Email envoyé", "pdf": pdf_path}


