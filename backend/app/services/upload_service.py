import os
from fastapi import UploadFile
from sqlalchemy.orm import Session
from backend.app.models.cv_files import CVFile
from datetime import datetime

UPLOAD_DIR = "uploads"

def save_upload_file(db: Session, file: UploadFile) -> CVFile:
    # Atao azo antoka fa misy ny dossier
    os.makedirs(UPLOAD_DIR, exist_ok=True)

    # Path feno
    file_path = os.path.join(UPLOAD_DIR, file.filename)

    # Soratana amin'ny disk ilay fichier
    with open(file_path, "wb") as buffer:
        buffer.write(file.file.read())

    # Metadata ao amin'ny DB
    db_file = CVFile(
        filename=file.filename,
        path=file_path,
        mimetype=file.content_type,
        size=os.path.getsize(file_path),
        uploaded_at=datetime.utcnow()
    )

    db.add(db_file)
    db.commit()
    db.refresh(db_file)

    return db_file
