from sqlalchemy import Column, Integer, String, Text, DateTime
from app.db import Base
from datetime import datetime

class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    titre = Column(String, nullable=False)
    contenu = Column(Text)
    date_creation = Column(DateTime, default=datetime.utcnow)
