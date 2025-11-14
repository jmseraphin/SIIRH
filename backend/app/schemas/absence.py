# from datetime import date
# from pydantic import BaseModel
# from typing import Optional

# # 🔹 Schema base
# class AbsenceBase(BaseModel):
#     employee_id: int
#     type: str
#     date: date
#     motif: Optional[str] = ""
#     statut: Optional[str] = "en attente"

# # 🔹 Schema pour création
# class AbsenceCreate(AbsenceBase):
#     pass

# # 🔹 Schema pour update
# class AbsenceUpdate(BaseModel):
#     employee_id: Optional[int] = None
#     type: Optional[str] = None
#     date: Optional[date] = None
#     motif: Optional[str] = None
#     statut: Optional[str] = None

# # 🔹 Schema pour lecture / GET
# class AbsenceRead(AbsenceBase):
#     id: int

#     class Config:
#         from_attributes = True  # 🔹 Pydantic v2












from datetime import date
from typing import Optional
from pydantic import BaseModel

# 🔹 Schema base (common fields)
class AbsenceBase(BaseModel):
    employee_id: int
    date_debut: date
    date_fin: date
    type_absence: str
    motif: Optional[str] = ""
    statut: Optional[str] = "en attente"

# 🔹 Schema pour création
class AbsenceCreate(AbsenceBase):
    pass

# 🔹 Schema pour update
class AbsenceUpdate(BaseModel):
    employee_id: Optional[int] = None
    date_debut: Optional[date] = None
    date_fin: Optional[date] = None
    type_absence: Optional[str] = None
    motif: Optional[str] = None
    statut: Optional[str] = None

# 🔹 Schema pour lecture / GET
class AbsenceOut(AbsenceBase):
    id: int

    class Config:
        from_attributes = True  # ✅ Pydantic v2
