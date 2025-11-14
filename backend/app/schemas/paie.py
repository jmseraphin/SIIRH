from pydantic import BaseModel
from typing import Optional

class PaieBase(BaseModel):
    montant: float
    employee_id: int

class PaieCreate(PaieBase):
    pass

class PaieUpdate(BaseModel):
    montant: Optional[float] = None

class PaieOut(PaieBase):
    id: int

    class Config:
        orm_mode = True
