from sqlalchemy import Column, Integer, String, Float, ForeignKey, Text, JSON, Date
from sqlalchemy.orm import relationship
from app.db import Base

# =======================
# MODELS
# =======================

class Offre(Base):
    __tablename__ = "offres"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True)
    titre = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    competences = Column(Text, nullable=True)
    date_cloture = Column(String(50), nullable=True)

    # Relation vers Candidature
    candidatures = relationship(
        "Candidature",
        back_populates="offre",
        cascade="all, delete-orphan"
    )


class Candidature(Base):
    __tablename__ = "candidatures"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True)
    fullname = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=True)
    source = Column(String(100), nullable=True)
    raw_cv_s3 = Column(Text, nullable=True)
    parsed_json = Column(JSON, nullable=True)
    score = Column(Float, nullable=True)
    statut = Column(String(50), default="nouveau")

    offre_id = Column(Integer, ForeignKey("offres.id", ondelete="CASCADE"), nullable=False)

    # back ref vers Offre
    offre = relationship("Offre", back_populates="candidatures")

    # Relation vers Convocation
    convocations = relationship(
        "Convocation",
        back_populates="candidature",
        cascade="all, delete-orphan"
    )

    # Relation optionally vers Employee
    employee = relationship("Employee", back_populates="candidature", uselist=False)


class Employee(Base):
    __tablename__ = "employees"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True)
    fullname = Column(String(255), nullable=False)
    email = Column(String(255), nullable=True)
    phone = Column(String(50), nullable=True)
    poste = Column(String(100), nullable=True)
    candidature_id = Column(Integer, ForeignKey("candidatures.id"), nullable=True)

    # Relation vers Candidature
    candidature = relationship("Candidature", back_populates="employee")

    # Relation vers Paie
    paies = relationship("Paie", back_populates="employee")

    # Relation vers Contrat
    contrats = relationship("Contrat", back_populates="employee")


class Paie(Base):
    __tablename__ = "paies"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True)
    montant = Column(Float, nullable=False)
    employee_id = Column(Integer, ForeignKey("employees.id"))

    # back ref vers Employee
    employee = relationship("Employee", back_populates="paies")


class Contrat(Base):
    __tablename__ = "contrats"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    type_contrat = Column(String(50), nullable=False)
    date_debut = Column(Date, nullable=False)
    date_fin = Column(Date, nullable=True)
    salaire = Column(Float, nullable=True)

    # back ref vers Employee
    employee = relationship("Employee", back_populates="contrats")


class Utilisateur(Base):
    __tablename__ = "utilisateurs"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), nullable=False)
    password = Column(String(255), nullable=False)


# ======= Convocation (Fanitsiana) =======
class Convocation(Base):
    __tablename__ = "convocations"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True)
    date_entretien = Column(String(50), nullable=True)   # ✅ date entretien
    heure_entretien = Column(String(50), nullable=True)  # ✅ heure entretien
    lieu_entretien = Column(String(255), nullable=True)  # ✅ lieu entretien
    status = Column(String(50), nullable=True)           # ✅ status convocation
    lien_fichier = Column(String(255), nullable=True)    # ✅ chemin PDF si tiana
    candidature_id = Column(Integer, ForeignKey("candidatures.id"))

    # back ref vers Candidature
    candidature = relationship("Candidature", back_populates="convocations")


# =======================
# __all__ pour imports
# =======================
__all__ = [
    "Employee",
    "Paie",
    "Contrat",
    "Utilisateur",
    "Offre",
    "Candidature",
    "Convocation",
]
