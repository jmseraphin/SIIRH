# from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
# from sqlalchemy.orm import relationship
# from app.db import Base
# from datetime import datetime

# class DisciplineCase(Base):
#     __tablename__ = "discipline_cases"

#     id = Column(Integer, primary_key=True, index=True)
#     employee_id = Column(Integer, nullable=False)
#     fault_type = Column(String(50), nullable=False)
#     description = Column(Text)
#     status = Column(String(50), default="En cours")
#     created_at = Column(DateTime, default=datetime.now)
#     updated_at = Column(DateTime, default=datetime.now)

#     evidences = relationship("Evidence", back_populates="discipline_case", cascade="all, delete-orphan")
#     events = relationship("Event", back_populates="discipline_case", cascade="all, delete-orphan")


# class Evidence(Base):
#     __tablename__ = "discipline_evidences"

#     id = Column(Integer, primary_key=True, index=True)
#     discipline_case_id = Column(Integer, ForeignKey("discipline_cases.id"))
#     file_name = Column(String(255))
#     file_url = Column(String(500))
#     created_at = Column(DateTime, default=datetime.now)

#     discipline_case = relationship("DisciplineCase", back_populates="evidences")


# class Event(Base):
#     __tablename__ = "discipline_events"

#     id = Column(Integer, primary_key=True, index=True)
#     discipline_case_id = Column(Integer, ForeignKey("discipline_cases.id"))
#     event_type = Column(String(50))
#     event_data = Column(Text)
#     created_at = Column(DateTime, default=datetime.now)

#     discipline_case = relationship("DisciplineCase", back_populates="events")







from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.db import Base
from datetime import datetime

# ==========================================================
# DisciplineCase
# ==========================================================
class DisciplineCase(Base):
    __tablename__ = "discipline_cases"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, nullable=False)
    fault_type = Column(String(50), nullable=False)
    description = Column(Text)
    status = Column(String(50), default="En cours")
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now)

    # Relations
    evidences = relationship("DisciplineEvidence", back_populates="discipline_case", cascade="all, delete-orphan")
    events = relationship("Event", back_populates="discipline_case", cascade="all, delete-orphan")


# ==========================================================
# DisciplineEvidence
# ==========================================================
class DisciplineEvidence(Base):
    __tablename__ = "discipline_evidences"
    __table_args__ = {"extend_existing": True}  # ➡️ mba tsy hiteraka duplication

    id = Column(Integer, primary_key=True, index=True)
    discipline_case_id = Column(Integer, ForeignKey("discipline_cases.id"), nullable=False)
    file_name = Column(String(255), nullable=False)
    file_url = Column(String(500), nullable=False)
    created_at = Column(DateTime, default=datetime.now)

    # Relation miverina amin'ny DisciplineCase
    discipline_case = relationship("DisciplineCase", back_populates="evidences")


# ==========================================================
# Event
# ==========================================================
class Event(Base):
    __tablename__ = "discipline_events"

    id = Column(Integer, primary_key=True, index=True)
    discipline_case_id = Column(Integer, ForeignKey("discipline_cases.id"))
    event_type = Column(String(50))
    event_data = Column(Text)
    created_at = Column(DateTime, default=datetime.now)

    discipline_case = relationship("DisciplineCase", back_populates="events")
