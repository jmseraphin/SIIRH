from pydantic import BaseModel
from datetime import date
from typing import Optional

# ===================== Base =====================
class PaieBase(BaseModel):
    employee_id: int
    salaire_base: float
    prime: Optional[float] = 0.0
    deduction: Optional[float] = 0.0
    salaire_net: Optional[float] = 0.0
    date_paie: Optional[date] = None


# ===================== Création =====================
class PaieCreate(PaieBase):
    pass


# ===================== Mise à jour =====================
class PaieUpdate(BaseModel):
    salaire_base: Optional[float] = None
    prime: Optional[float] = None
    deduction: Optional[float] = None
    salaire_net: Optional[float] = None
    date_paie: Optional[date] = None


# ===================== Sortie =====================
class PaieOut(PaieBase):
    id: int

    class Config:
        from_attributes = True
