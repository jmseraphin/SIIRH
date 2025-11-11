# from sqlalchemy import Column, Integer, String, Float, ForeignKey, Text, JSON
# from sqlalchemy.orm import relationship
# from app.db import Base

# class Offre(Base):
#     __tablename__ = "offres"

#     id = Column(Integer, primary_key=True, index=True)
#     titre = Column(String(255))
#     description = Column(Text)
#     competences = Column(Text)
#     date_cloture = Column(String(50))

#     candidatures = relationship("Candidature", back_populates="offre")


# class Candidature(Base):
#     __tablename__ = "candidatures"

#     id = Column(Integer, primary_key=True, index=True)
#     fullname = Column(String(255))
#     email = Column(String(255))
#     phone = Column(String(50))
#     source = Column(String(100))
#     raw_cv_s3 = Column(Text)
#     parsed_json = Column(JSON)
#     score = Column(Float)
#     statut = Column(String(50), default="nouveau")

#     # Ity no zava-dehibe 😎
#     offre_id = Column(Integer, ForeignKey("offres.id"))
#     offre = relationship("Offre", back_populates="candidatures")



# from sqlalchemy import Column, Integer, String, Float, ForeignKey, Text, JSON
# from sqlalchemy.orm import relationship
# from app.db import Base


# class Offre(Base):
#     __tablename__ = "offres"

#     id = Column(Integer, primary_key=True, index=True)
#     titre = Column(String(255), nullable=False)
#     description = Column(Text, nullable=True)
#     competences = Column(Text, nullable=True)
#     date_cloture = Column(String(50), nullable=True)

#     # Relation vers les candidatures liées à cette offre
#     candidatures = relationship(
#         "Candidature",
#         back_populates="offre",
#         cascade="all, delete-orphan"
#     )


# class Candidature(Base):
#     __tablename__ = "candidatures"

#     id = Column(Integer, primary_key=True, index=True)
#     fullname = Column(String(255), nullable=False)
#     email = Column(String(255), nullable=False)
#     phone = Column(String(50), nullable=True)
#     source = Column(String(100), nullable=True)
#     raw_cv_s3 = Column(Text, nullable=True)
#     parsed_json = Column(JSON, nullable=True)
#     score = Column(Float, nullable=True)
#     statut = Column(String(50), default="nouveau")

#     # Clé étrangère vers Offre
#     offre_id = Column(Integer, ForeignKey("offres.id", ondelete="CASCADE"), nullable=False)

#     # Relation inverse vers Offre
#     offre = relationship("Offre", back_populates="candidatures")





# from sqlalchemy import Column, Integer, String, Float, ForeignKey, Text, JSON
# from sqlalchemy.orm import relationship
# from app.db import Base


# class Offre(Base):
#     __tablename__ = "offres"
#     __table_args__ = {"extend_existing": True}

#     id = Column(Integer, primary_key=True, index=True)
#     titre = Column(String(255), nullable=False)
#     description = Column(Text, nullable=True)
#     competences = Column(Text, nullable=True)
#     date_cloture = Column(String(50), nullable=True)

#     # Relation vers Candidature
#     candidatures = relationship(
#         "Candidature",
#         back_populates="offre",
#         cascade="all, delete-orphan"
#     )


# class Candidature(Base):
#     __tablename__ = "candidatures"
#     __table_args__ = {"extend_existing": True}

#     id = Column(Integer, primary_key=True, index=True)
#     fullname = Column(String(255), nullable=False)
#     email = Column(String(255), nullable=False)
#     phone = Column(String(50), nullable=True)
#     source = Column(String(100), nullable=True)
#     raw_cv_s3 = Column(Text, nullable=True)
#     parsed_json = Column(JSON, nullable=True)
#     score = Column(Float, nullable=True)
#     statut = Column(String(50), default="nouveau")

#     offre_id = Column(Integer, ForeignKey("offres.id", ondelete="CASCADE"), nullable=False)

#     # back ref
#     offre = relationship("Offre", back_populates="candidatures")

#     # Relation vers Convocation
#     convocations = relationship(
#         "Convocation",
#         back_populates="candidature",
#         cascade="all, delete-orphan"
#     )









from sqlalchemy import Column, Integer, String, Float, ForeignKey, Text, JSON
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
    title = Column(String(255), nullable=False)
    employee_id = Column(Integer, ForeignKey("employees.id"))

    # back ref vers Employee
    employee = relationship("Employee")


class Utilisateur(Base):
    __tablename__ = "utilisateurs"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), nullable=False)
    password = Column(String(255), nullable=False)


class Convocation(Base):
    __tablename__ = "convocations"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True)
    date = Column(String(50), nullable=True)
    lieu = Column(String(255), nullable=True)
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
