from datetime import date
from typing import Optional
from pydantic import BaseModel, validator

# --------------------
# Contrat schemas efa misy
# --------------------
class ContratBase(BaseModel):
    employee_id: int
    type_contrat: str
    date_debut: date
    date_fin: Optional[date] = None
    salaire: Optional[float] = 0.0

    @validator("date_fin", pre=True, always=True)
    def empty_string_to_none(cls, v):
        if v == "":
            return None
        return v

    class Config:
        orm_mode = True

class ContratCreate(ContratBase):
    pass

class ContratUpdate(BaseModel):
    employee_id: Optional[int] = None
    type_contrat: Optional[str] = None
    date_debut: Optional[date] = None
    date_fin: Optional[date] = None
    salaire: Optional[float] = None

    class Config:
        orm_mode = True

class ContratOut(ContratBase):
    id: int

    class Config:
        orm_mode = True

# --------------------
# Convocation schemas (fanampiana)
# --------------------
class ConvocationBase(BaseModel):
    date_entretien: Optional[str] = None
    heure_entretien: Optional[str] = None
    lieu_entretien: Optional[str] = None
    status: Optional[str] = None
    lien_fichier: Optional[str] = None

    class Config:
        orm_mode = True

class ConvocationCreate(ConvocationBase):
    candidature_id: int

class ConvocationOut(ConvocationBase):
    id: int
