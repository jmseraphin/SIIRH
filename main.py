import os
import json
import shutil
from pathlib import Path
from typing import Optional

from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import databases
import sqlalchemy

# --- Configuration DB ---
DB_USER = os.getenv("DB_USER", "siirh_user")
DB_PASSWORD = os.getenv("DB_PASSWORD", "Jeremi123")
DB_HOST = os.getenv("DB_HOST", "db")  # Docker service name
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME", "siirh")

DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
database = databases.Database(DATABASE_URL)
metadata = sqlalchemy.MetaData()

# --- Table candidature ---
candidatures = sqlalchemy.Table(
    "candidatures",
    metadata,
    sqlalchemy.Column("id", sqlalchemy.Integer, primary_key=True),
    sqlalchemy.Column("lastname", sqlalchemy.String),
    sqlalchemy.Column("firstname", sqlalchemy.String),
    sqlalchemy.Column("email", sqlalchemy.String),
    sqlalchemy.Column("phone", sqlalchemy.String),
    sqlalchemy.Column("job_ref", sqlalchemy.String),
    sqlalchemy.Column("cv_filename", sqlalchemy.String),
    sqlalchemy.Column("job_requirements", sqlalchemy.JSON),
    sqlalchemy.Column("score", sqlalchemy.Float)
)

# --- Engine SQLAlchemy ---
engine = sqlalchemy.create_engine(DATABASE_URL)
metadata.create_all(engine)

# --- FastAPI App ---
app = FastAPI()

# ✅ CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Uploads folder ---
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

# --- Pydantic Model ---
class CandidatureBase(BaseModel):
    job_ref: str
    lastname: str
    firstname: str
    email: str
    phone: Optional[str] = None
    job_requirements: dict

# --- Root endpoint ---
@app.get("/")
async def root():
    return {"message": "Bienvenue sur SIIRH API avec PostgreSQL 🎉"}

# --- Endpoint POST candidature pour le candidat ---
@app.post("/api/recrutement/candidatures")
async def create_candidature(
    job_ref: str = Form(...),
    lastname: str = Form(...),
    firstname: str = Form(...),
    email: str = Form(...),
    phone: Optional[str] = Form(None),
    cv_file: UploadFile = File(...),
    job_requirements: str = Form(...)
):
    # --- Mitahiry CV ---
    file_location = UPLOAD_DIR / cv_file.filename
    with file_location.open("wb") as f:
        shutil.copyfileobj(cv_file.file, f)

    # --- Parse JSON ---
    try:
        job_req_dict = json.loads(job_requirements)
    except json.JSONDecodeError:
        job_req_dict = {}

    # --- Calcul scoring simplifié ---
    skills_required = job_req_dict.get("skills", [])
    candidate_skills = job_req_dict.get("candidate_skills", skills_required)
    score_skills = (len(set(skills_required) & set(candidate_skills)) / max(len(skills_required), 1)) * 30
    score_exp = min(job_req_dict.get("candidate_exp", 0) / max(job_req_dict.get("exp_years", 1), 1), 1) * 25
    score_degree = 20 if job_req_dict.get("candidate_degree", "") == job_req_dict.get("degree", "") else 10
    score_projects = job_req_dict.get("projects_score", 15)
    score_total = score_skills + score_exp + score_degree + score_projects

    # --- Insert into DB ---
    query = candidatures.insert().values(
        lastname=lastname,
        firstname=firstname,
        email=email,
        phone=phone,
        job_ref=job_ref,
        cv_filename=cv_file.filename,
        job_requirements=job_req_dict,
        score=score_total
    )
    await database.connect()
    last_record_id = await database.execute(query)
    await database.disconnect()

    # ✅ Retour pour candidat **sans score**
    return {
        "candidature_id": last_record_id,
        "message": "Votre candidature a été envoyée avec succès 🎉",
        "parsed_json": {
            "lastname": lastname,
            "firstname": firstname,
            "email": email,
            "phone": phone,
            "job_ref": job_ref,
            "cv_filename": cv_file.filename,
            "job_requirements": job_req_dict
        }
    }

# --- Importation du router RH (seul RH mahita score)
from app.routers import candidature_rh
app.include_router(candidature_rh.router, prefix="/api/recrutement", tags=["RH"])
