from sqlalchemy import Column, Integer, Float, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.db import Base

class Paie(Base):
    __tablename__ = "paies"

    id = Column(Integer, primary_key=True, index=True)
    montant = Column(Float, nullable=False)
    date_paie = Column(Date, nullable=False)
    employee_id = Column(Integer, ForeignKey("employees.id"))

    employee = relationship("Employee", back_populates="paies")
