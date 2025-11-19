from sqlalchemy.orm import Session
from app.models import discipline as models
from app.schemas import discipline as schemas
from datetime import datetime

def create_discipline_case(db: Session, case: schemas.DisciplineCaseCreate):
    db_case = models.DisciplineCase(
        employee_id=case.employee_id,
        fault_type=case.fault_type,
        description=case.description,
        status="En cours",
        created_at=datetime.now(),
        updated_at=datetime.now()
    )
    db.add(db_case)
    db.commit()
    db.refresh(db_case)
    return db_case

def get_case(db: Session, case_id: int):
    return db.query(models.DisciplineCase).filter(models.DisciplineCase.id == case_id).first()

def list_cases(db: Session):
    return db.query(models.DisciplineCase).all()
