# from pydantic import BaseModel, EmailStr
# from typing import Optional
# from datetime import datetime


# # --- 🔹 Candidature ---
# class CandidatureBase(BaseModel):
#     nom: str
#     prenom: str
#     email: EmailStr
#     telephone: Optional[str] = None
#     adresse: Optional[str] = None
#     date_naissance: Optional[str] = None
#     poste: str
#     disponibilite: Optional[str] = None
#     salaire: Optional[str] = None
#     type_contrat: Optional[str] = None
#     mobilite: Optional[str] = None
#     autorisation: Optional[str] = None
#     cv_path: Optional[str] = None
#     lettre_path: Optional[str] = None
#     diplomes_path: Optional[str] = None
#     statut: Optional[str] = "En attente"
#     score: Optional[float] = None
#     date_candidature: Optional[datetime] = None

#     class Config:
#         from_attributes = True


# class CandidatureResponse(CandidatureBase):
#     id: int

#     class Config:
#         from_attributes = True






from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

# --- 🔹 Candidature ---
class CandidatureBase(BaseModel):
    nom: str
    prenom: str
    email: EmailStr
    telephone: Optional[str] = None
    adresse: Optional[str] = None
    date_naissance: Optional[str] = None
    poste: str
    disponibilite: Optional[str] = None
    salaire: Optional[str] = None
    type_contrat: Optional[str] = None
    mobilite: Optional[str] = None
    autorisation: Optional[str] = None
    cv_path: Optional[str] = None
    lettre_path: Optional[str] = None
    diplomes_path: Optional[str] = None
    statut: Optional[str] = "En attente"
    score: Optional[float] = None
    date_candidature: Optional[datetime] = None

    class Config:
        from_attributes = True

class CandidatureResponse(CandidatureBase):
    id: int

    class Config:
        from_attributes = True

# --- 🔹 Employee ---
class EmployeeCreate(BaseModel):
    candidat_id: int  # ✅ fanampiana ho an'ny POST /employees/

    class Config:
        from_attributes = True
