from sqlalchemy.orm import Session
from app.models import Candidature

def create_candidature(db: Session, data: dict):
    db_cand = Candidature(**data)
    db.add(db_cand)
    db.commit()
    db.refresh(db_cand)
    return db_cand

def get_all_candidatures(db: Session, status: str = None):
    query = db.query(Candidature)
    # filtre raha misy status
    return query.all()
