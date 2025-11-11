from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.db import Base

class Contrat(Base):
    __tablename__ = "contrats"

    id = Column(Integer, primary_key=True, index=True)
    type_contrat = Column(String(50), nullable=False)
    date_debut = Column(Date, nullable=False)
    date_fin = Column(Date, nullable=True)
    employee_id = Column(Integer, ForeignKey("employees.id"))

    employee = relationship("Employee", backref="contrats")
