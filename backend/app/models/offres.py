# app/models/offres.py
from sqlalchemy import Column, Integer, String, Date, Float
from sqlalchemy.orm import relationship
from app.db import Base
import json

class Offre(Base):
    __tablename__ = "offres"

    id = Column(Integer, primary_key=True, index=True)
    job_ref = Column(String, unique=True, nullable=False)
    title = Column(String, nullable=True)
    department = Column(String, nullable=True)
    site = Column(String, nullable=True)
    contract_type = Column(String, nullable=True)
    creation_date = Column(Date, nullable=True)

    # Description
    mission = Column(String, nullable=True)
    activities_public = Column(String, nullable=True)
    goals = Column(String, nullable=True)

    # Profil
    education_level = Column(String, nullable=True)
    exp_required_years = Column(Integer, nullable=True)

    # Scoring
    tech_skills = Column(String, nullable=True)       # JSON string
    soft_skills = Column(String, nullable=True)       # JSON string
    langs_lvl = Column(String, nullable=True)         # JSON string
    w_skills = Column(Float, default=0.4)
    w_exp = Column(Float, default=0.3)
    w_edu = Column(Float, default=0.2)
    w_proj = Column(Float, default=0.1)
    threshold = Column(Float, default=60)
    scoring_config_path = Column(String, default="/configs/scoring_default.json")

    # Relation avec Candidature
    candidatures = relationship("Candidature", back_populates="offre", cascade="all, delete-orphan")

    deadline = Column(Date, nullable=True)
    apply_link = Column(String, nullable=True)

    # -----------------------
    # JSON helpers
    # -----------------------
    def set_tech_skills(self, skills):
        self.tech_skills = json.dumps(skills)

    def get_tech_skills(self):
        return json.loads(self.tech_skills) if self.tech_skills else []

    def set_soft_skills(self, skills):
        self.soft_skills = json.dumps(skills)

    def get_soft_skills(self):
        return json.loads(self.soft_skills) if self.soft_skills else []

    def set_langs_lvl(self, langs):
        self.langs_lvl = json.dumps(langs)

    def get_langs_lvl(self):
        return json.loads(self.langs_lvl) if self.langs_lvl else {}
