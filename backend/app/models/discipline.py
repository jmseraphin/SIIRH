from sqlalchemy import Column, Integer, String, Text, ForeignKey, TIMESTAMP
from sqlalchemy.orm import relationship
from app.db import Base

class DisciplineCase(Base):
    __tablename__ = "discipline_cases"
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    fault_type = Column(String(100), nullable=False)
    description = Column(Text)
    status = Column(String(50), default="En cours")
    created_at = Column(TIMESTAMP)
    updated_at = Column(TIMESTAMP)

    evidences = relationship("DisciplineEvidence", back_populates="case")
    events = relationship("DisciplineEvent", back_populates="case")
    decision = relationship("DisciplineDecision", back_populates="case", uselist=False)

class DisciplineEvidence(Base):
    __tablename__ = "discipline_evidences"
    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(Integer, ForeignKey("discipline_cases.id"))
    file_name = Column(String(255))
    file_url = Column(Text)
    uploaded_at = Column(TIMESTAMP)

    case = relationship("DisciplineCase", back_populates="evidences")

class DisciplineEvent(Base):
    __tablename__ = "discipline_events"
    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(Integer, ForeignKey("discipline_cases.id"))
    event_type = Column(String(50))
    event_data = Column(Text)
    created_at = Column(TIMESTAMP)

    case = relationship("DisciplineCase", back_populates="events")

class DisciplineDecision(Base):
    __tablename__ = "discipline_decisions"
    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(Integer, ForeignKey("discipline_cases.id"))
    decision_type = Column(String(50))
    decision_notes = Column(Text)
    letter_url = Column(Text)
    decided_at = Column(TIMESTAMP)

    case = relationship("DisciplineCase", back_populates="decision")
