# backend/app/routers/candidature_rh.py
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.db import get_db
from app.models import Candidature  # Raha misy model SQLAlchemy ianao
import json

router = APIRouter(
    prefix="/api/recrutement/candidatures_rh",
    tags=["candidatures_rh"]
)

@router.get("/")
async def get_all_candidatures(db: Session = Depends(get_db)):
    """
    Mamerina ny candidatures rehetra ho an'ny RH.
    Score feno ihany no azo avy eto, tsy alefa amin'ny candidat.
    """
    try:
        results = db.query(Candidature).all()
        response = []
        for cand in results:
            response.append({
                "id": cand.id,
                "lastname": cand.lastname,
                "firstname": cand.firstname,
                "email": cand.email,
                "phone": cand.phone,
                "job_ref": cand.job_ref,
                "cv_filename": cand.cv_filename,
                "job_requirements": cand.job_requirements,
                "score": cand.score  # RH ihany no mahita score
            })
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
