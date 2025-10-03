from sqlalchemy import Column, Integer, String, Date, Text, JSON, Numeric, Boolean, TIMESTAMP, ForeignKey
from sqlalchemy.sql import func
from database import Base

class Candidature(Base):
    __tablename__ = "candidatures"

    id = Column(Integer, primary_key=True, index=True)
    job_ref = Column(String(100), nullable=False)

    # Identification
    lastname = Column(String(100), nullable=False)
    firstname = Column(String(100), nullable=False)
    email = Column(String(150), nullable=False)
    phone = Column(String(50))
    address = Column(Text)
    city = Column(String(100))
    birthdate = Column(Date)

    # Documents
    cv_file_id = Column(Integer, ForeignKey("cv_files.id", ondelete="SET NULL"))
    lm_file_id = Column(Integer)
    diplomes_zip_id = Column(Integer)

    # Parcours & compétences
    last_job = Column(String(150))
    last_company = Column(String(150))
    exp_years = Column(Integer)
    skills = Column(JSON)
    langs_lvl = Column(JSON)
    mobility_sites = Column(JSON)

    # Conditions & disponibilité
    avail_date = Column(Date)
    sal_expectation = Column(Numeric(12,2))
    contract_accepted = Column(String(50))
    work_permit_status = Column(String(50))

    # Consentement
    consent_bool = Column(Boolean, default=False)

    # Métadonnées
    parsed_json = Column(JSON)
    score = Column(Numeric(5,2))
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())
