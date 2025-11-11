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
