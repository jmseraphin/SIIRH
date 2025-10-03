from pydantic import BaseModel
from typing import Optional

class CandidatureResponse(BaseModel):
    id: int
    fullname: str
    email: str
    phone: Optional[str]
    score: float
    raw_cv_path: str

    class Config:
        orm_mode = True
