from pydantic import BaseModel
from typing import List, Optional

class Evidence(BaseModel):
    file_name: str
    file_url: str

class Event(BaseModel):
    event_type: str
    event_data: dict

class Decision(BaseModel):
    decision_type: str
    decision_notes: str
    letter_url: Optional[str] = None

class DisciplineCaseBase(BaseModel):
    employee_id: int
    fault_type: str
    description: Optional[str] = None

class DisciplineCaseCreate(DisciplineCaseBase):
    evidences: Optional[List[Evidence]] = []
    events: Optional[List[Event]] = []
    decision: Optional[Decision] = None

class DisciplineCase(DisciplineCaseBase):
    id: int
    status: str
    evidences: List[Evidence] = []
    events: List[Event] = []
    decision: Optional[Decision] = None

    class Config:
        orm_mode = True
