from datetime import date
from pydantic import BaseModel
from typing import Optional

# =====================
# 🔹 Schema base
# =====================
class AbsenceBase(BaseModel):
    employee_id: int
    type_absence: str       # mifanaraka amin'ny frontend React
    date_debut: date
    date_fin: date
    motif: Optional[str] = ""
    statut: Optional[str] = "en attente"

# =====================
# 🔹 Schema pour création
# =====================
class AbsenceCreate(AbsenceBase):
    pass

# =====================
# 🔹 Schema pour update
# =====================
class AbsenceUpdate(BaseModel):
    employee_id: Optional[int] = None
    type_absence: Optional[str] = None
    date_debut: Optional[date] = None
    date_fin: Optional[date] = None
    motif: Optional[str] = None
    statut: Optional[str] = None

# =====================
# 🔹 Schema pour lecture / GET
# =====================
class AbsenceRead(AbsenceBase):
    id: int

    class Config:
        from_attributes = True  # Pydantic v2, mba tsy hiseho ny warning
