from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict
from datetime import date
from decimal import Decimal

class CandidatureCreate(BaseModel):
    job_ref: str
    lastname: str
    firstname: str
    email: EmailStr
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    birthdate: Optional[date] = None
    cv_file_id: int
    lm_file_id: Optional[int] = None
    diplomes_zip_id: Optional[int] = None
    last_job: Optional[str] = None
    last_company: Optional[str] = None
    exp_years: Optional[int] = None
    skills: Optional[List[str]] = None
    langs_lvl: Optional[Dict[str, str]] = None
    mobility_sites: Optional[List[str]] = None
    avail_date: Optional[date] = None
    sal_expectation: Optional[Decimal] = None
    contract_accepted: Optional[str] = None
    work_permit_status: Optional[str] = None
    consent_bool: bool = False

class CandidatureRead(CandidatureCreate):
    id: int

    class Config:
        orm_mode = True
