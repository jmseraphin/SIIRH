from pydantic import BaseModel
from typing import Optional
from datetime import date

class EmployeeBase(BaseModel):
    nom: str
    prenom: str
    email: str
    poste: Optional[str] = None
    date_embauche: Optional[date] = None

class EmployeeCreate(EmployeeBase):
    pass

class EmployeeUpdate(EmployeeBase):
    pass

class EmployeeResponse(EmployeeBase):
    id: int

    class Config:
        orm_mode = True
# -------------------------------
# Schema fohy ho an'ny Discipline (autocomplete, tableau, sns)
# -------------------------------
class Employee(BaseModel):
    id: int
    nom: str
    prenom: str
    email: Optional[str] = None
    poste: Optional[str] = None

    class Config:
        from_attributes = True   # Pydantic v2
