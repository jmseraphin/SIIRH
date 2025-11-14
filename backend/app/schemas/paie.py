# from pydantic import BaseModel
# from typing import Optional

# # ------------------------
# # Pour l'employé lié à la paie
# # ------------------------
# class EmployeeOut(BaseModel):
#     id: int
#     fullname: str  # Ataovy hoe efa manana property fullname ao amin'ny model Employee

#     class Config:
#         orm_mode = True

# # ------------------------
# # Base pour shared fields
# # ------------------------
# class PaieBase(BaseModel):
#     employee_id: int
#     salaire_base: Optional[float] = None
#     primes: Optional[float] = 0.0
#     heures_supp: Optional[float] = 0.0
#     deductions: Optional[float] = 0.0
#     absence_deduction: Optional[float] = 0.0
#     salaire_net: Optional[float] = None
#     montant: Optional[float] = None
#     mois: str
#     annee: int

# # ------------------------
# # Pour création
# # ------------------------
# class PaieCreate(PaieBase):
#     pass

# # ------------------------
# # Pour mise à jour
# # ------------------------
# class PaieUpdate(BaseModel):
#     salaire_base: Optional[float] = None
#     primes: Optional[float] = None
#     heures_supp: Optional[float] = None
#     deductions: Optional[float] = None
#     absence_deduction: Optional[float] = None
#     salaire_net: Optional[float] = None
#     montant: Optional[float] = None
#     mois: Optional[str] = None
#     annee: Optional[int] = None

# # ------------------------
# # Pour lecture (avec id et employé lié)
# # ------------------------
# class PaieOut(PaieBase):
#     id: int
#     employee: Optional[EmployeeOut]  # <--- Ampidirina eto ny relation

#     class Config:
#         orm_mode = True




from pydantic import BaseModel
from typing import Optional

# ------------------------
# Pour l'employé lié à la paie
# ------------------------
class EmployeeOut(BaseModel):
    id: int
    fullname: str  # Ataovy hoe efa manana property fullname ao amin'ny model Employee

    class Config:
        from_attributes = True

# ------------------------
# Base pour shared fields
# ------------------------
class PaieBase(BaseModel):
    employee_id: int
    salaire_base: Optional[float] = None
    primes: Optional[float] = 0.0
    heures_supp: Optional[float] = 0.0
    deductions: Optional[float] = 0.0
    absence_deduction: Optional[float] = 0.0
    salaire_net: Optional[float] = None
    montant: Optional[float] = None
    mois: str
    annee: int

# ------------------------
# Pour création
# ------------------------
class PaieCreate(PaieBase):
    pass

# ------------------------
# Pour mise à jour
# ------------------------
class PaieUpdate(BaseModel):
    salaire_base: Optional[float] = None
    primes: Optional[float] = None
    heures_supp: Optional[float] = None
    deductions: Optional[float] = None
    absence_deduction: Optional[float] = None
    salaire_net: Optional[float] = None
    montant: Optional[float] = None
    mois: Optional[str] = None
    annee: Optional[int] = None

# ------------------------
# Pour lecture (avec id et employé lié)
# ------------------------
class PaieOut(PaieBase):
    id: int
    employee: Optional[EmployeeOut]

    class Config:
        from_attributes = True
