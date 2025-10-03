from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Soloina araka ny configuration-nao
DB_USER = "siirh_user"
DB_PASSWORD = "Jeremi123"  
DB_HOST = "localhost"
DB_PORT = "5432"
DB_NAME = "siirh"

DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# Mamorona engine
engine = create_engine(DATABASE_URL, echo=True)  # echo=True mba hiseho ny queries ao amin'ny terminal

# Session ho an'ny database
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base ho an'ny models
Base = declarative_base()

# ⚡ Dependency ho an'ny routes
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
