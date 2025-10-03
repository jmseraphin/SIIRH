from app.models import Candidature

def create_candidature(db, db_data):
    db_cand = Candidature(**db_data)
    db.add(db_cand)
    db.commit()
    db.refresh(db_cand)
    return db_cand
