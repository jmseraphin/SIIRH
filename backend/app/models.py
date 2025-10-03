from sqlalchemy import Column, Integer, String, Text, Float
from app.db import Base

class Candidature(Base):
    __tablename__ = "candidatures"

    id = Column(Integer, primary_key=True, index=True)
    fullname = Column(String, nullable=False)
    email = Column(String, nullable=False, index=True)
    phone = Column(String, nullable=True)
    source = Column(String, default="web_form")
    raw_cv_path = Column(String, nullable=False)
    parsed_json = Column(Text, nullable=False)
    score = Column(Float, nullable=False)
