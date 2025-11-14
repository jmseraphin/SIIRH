# --- routers/candidature_selection.py ---
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db import get_db
from app.models.models import Candidature

router = APIRouter(prefix="/rh/candidatures", tags=["Candidature Selection"])

@router.put("/{candidature_id}/selection")
def update_selection(candidature_id: int, selected: bool, db: Session = Depends(get_db)):
    candidature = db.query(Candidature).filter(Candidature.id == candidature_id).first()
    if not candidature:
        raise HTTPException(status_code=404, detail="Candidat introuvable")

    # ✅ Mise à jour selection/deselection
    candidature.is_selected = selected
    db.commit()
    return {
        "id": candidature.id,
        "fullname": candidature.fullname,
        "is_selected": candidature.is_selected
    }
