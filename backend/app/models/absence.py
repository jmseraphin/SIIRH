from sqlalchemy import Column, Integer, String, Date, ForeignKey
from db import Base

class Absence(Base):
    __tablename__ = "absences"
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"))
    type_absence = Column(String, nullable=False)
    date_debut = Column(Date, nullable=False)
    date_fin = Column(Date, nullable=False)
    motif = Column(String, default="")
    statut = Column(String, default="en attente")
