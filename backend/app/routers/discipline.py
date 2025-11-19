# backend/app/routers/discipline.py
from fastapi import APIRouter, Depends, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List
from app import crud, schemas
from app.db import get_db

router = APIRouter(prefix="/discipline", tags=["Discipline"])

@router.post("/cases", response_model=schemas.DisciplineCase)
async def create_case(
    employee_id: int = Form(...),
    fault_type: str = Form(...),
    description: str = Form(None),
    files: List[UploadFile] = File(default=[]),
    db: Session = Depends(get_db),
):
    # Mamorona case
    case_data = schemas.DisciplineCaseCreate(
        employee_id=employee_id,
        fault_type=fault_type,
        description=description
    )
    case = crud.create_discipline_case(db, case_data)

    # Raha misy fichiers, tahirizo sy apetraho ao amin'ny Evidences
    for f in files:
        content = await f.read()
        file_path = f"/some/path/{f.filename}"  # na tahirizo araka ny projet-nao
        with open(file_path, "wb") as out_file:
            out_file.write(content)
        # Ampidiro ao amin'ny database
        crud.add_evidence(db, case.id, f.filename, file_path)

    return case
