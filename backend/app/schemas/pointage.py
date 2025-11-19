from pydantic import BaseModel
from datetime import date, time

class PointageBase(BaseModel):
    employee_id: int
    date: date
    heure_entree: time
    heure_sortie: time
    mode: str = "manuel"

class PointageCreate(PointageBase):
    pass

class PointageUpdate(PointageBase):
    pass

class PointageOut(PointageBase):
    id: int
    class Config:
        orm_mode = True
