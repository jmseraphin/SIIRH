# # convocation.py
# from fastapi import APIRouter, HTTPException, Depends
# from sqlalchemy.orm import Session
# from app.db import get_db
# from app.models.models import Candidature
# from app.models.convocation import Convocation
# from app.utils.pdf_generator import generate_convocation_pdf
# from datetime import datetime
# import logging
# import smtplib
# from email.mime.text import MIMEText
# from email.mime.multipart import MIMEMultipart
# from email.mime.base import MIMEBase
# from email import encoders
# import os
# from dotenv import load_dotenv

# # Load .env
# current_dir = os.path.dirname(__file__)
# dotenv_path = os.path.join(current_dir, "../.env")
# load_dotenv(dotenv_path)

# router = APIRouter()
# logger = logging.getLogger(__name__)
# logging.basicConfig(level=logging.INFO)

# DEFAULT_DATE_ENTRETIEN = "2025-10-30 10:00"
# DEFAULT_LIEU_ENTRETIEN = "Siège de l'entreprise, Antananarivo"

# @router.post("/rh/candidatures/{candidature_id}/send-invitation")
# def send_invitation(candidature_id: int, db: Session = Depends(get_db)):
#     candidature = db.query(Candidature).filter(Candidature.id == candidature_id).first()
#     if not candidature:
#         raise HTTPException(status_code=404, detail="Candidat introuvable")

#     nom_complet = getattr(candidature, "fullname", None) or f"{getattr(candidature, 'prenom', '')} {getattr(candidature, 'nom', '')}".strip() or "Candidat"
#     email_candidat = candidature.email
#     if not email_candidat:
#         raise HTTPException(status_code=400, detail="Email du candidat manquant")

#     try:
#         # Génération PDF
#         pdf_path = generate_convocation_pdf(candidature)
#         logger.info(f"✅ Convocation PDF généré : {pdf_path}")

#         # Création record Convocation
#         convocation = Convocation(
#             candidature_id=candidature.id,
#             date_envoi=datetime.now(),
#             status="envoyée",
#             lien_fichier=pdf_path
#         )
#         db.add(convocation)
#         db.commit()

#         # SMTP credentials
#         sender_email = os.getenv("SMTP_EMAIL")
#         sender_password = os.getenv("SMTP_PASSWORD")
#         smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
#         smtp_port = int(os.getenv("SMTP_PORT", 587))

#         if not sender_email or not sender_password:
#             logger.error("❌ SMTP credentials non trouvées")
#             raise HTTPException(status_code=500, detail="SMTP credentials mankany .env tsy hita")

#         # Préparation mail
#         message = MIMEMultipart()
#         message["Subject"] = "Convocation entretien - CODEL"
#         message["From"] = sender_email
#         message["To"] = email_candidat

#         html_content = f"""
#         <html>
#         <body>
#             <p>Bonjour <strong>{nom_complet}</strong>,</p>
#             <p>Vous êtes cordialement invité(e) à votre entretien pour le poste.</p>
#             <p><strong>Date et heure :</strong> {DEFAULT_DATE_ENTRETIEN}<br>
#                <strong>Lieu :</strong> {DEFAULT_LIEU_ENTRETIEN}</p>
#             <p>Veuillez consulter le PDF joint pour tous les détails et apporter les documents nécessaires.</p>
#             <p><em>Message automatique, ne pas répondre à ce mail.</em></p>
#             <p>Cordialement,<br><strong>Équipe RH</strong></p>
#         </body>
#         </html>
#         """
#         message.attach(MIMEText(html_content, "html", "utf-8"))

#         # Attacher PDF
#         with open(pdf_path, "rb") as f:
#             part = MIMEBase("application", "octet-stream")
#             part.set_payload(f.read())
#             encoders.encode_base64(part)
#             part.add_header(
#                 "Content-Disposition",
#                 f'attachment; filename="{os.path.basename(pdf_path)}"'
#             )
#             message.attach(part)

#         # Envoi via SMTP
#         with smtplib.SMTP(smtp_server, smtp_port) as server:
#             server.starttls()
#             server.login(sender_email, sender_password)
#             server.sendmail(sender_email, email_candidat, message.as_string())

#         logger.info(f"✅ Convocation envoyée à {nom_complet} ({email_candidat})")
#         return {
#             "message": f"Bonjour {nom_complet}, votre convocation a été envoyée avec succès ✅",
#             "pdf_path": pdf_path,
#             "date_entretien": DEFAULT_DATE_ENTRETIEN,
#             "lieu_entretien": DEFAULT_LIEU_ENTRETIEN,
#             "status": "success"
#         }

#     except Exception as e:
#         logger.error(f"❌ Erreur lors de l'envoi de convocation : {str(e)}")
#         raise HTTPException(status_code=500, detail=f"Erreur lors de l'envoi : {str(e)}")




# convocation.py
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.db import get_db
from app.models.models import Candidature
from app.models.models import Convocation
from app.utils.pdf_generator import generate_convocation_pdf
from datetime import datetime
import logging
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
import os
from dotenv import load_dotenv
from pydantic import BaseModel

# Load .env
current_dir = os.path.dirname(__file__)
dotenv_path = os.path.join(current_dir, "../.env")
load_dotenv(dotenv_path)

router = APIRouter()
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

# --- Model handray formulaire ---
class ConvocationForm(BaseModel):
    date: str
    heure: str
    lieu: str

# --- Create convocation (avy amin'ny formulaire) ---
@router.post("/rh/candidatures/{candidature_id}/create-convocation")
def create_convocation(candidature_id: int, form: ConvocationForm, db: Session = Depends(get_db)):
    candidature = db.query(Candidature).filter(Candidature.id == candidature_id).first()
    if not candidature:
        raise HTTPException(status_code=404, detail="Candidat introuvable")

    nom_complet = getattr(candidature, "fullname", None) or f"{getattr(candidature, 'prenom', '')} {getattr(candidature, 'nom', '')}".strip() or "Candidat"

    try:
        # Mamorona record ao amin'ny DB miaraka amin'ny formulaire
        convocation = Convocation(
            candidature_id=candidature.id,
            date_entretien=form.date,
            heure_entretien=form.heure,
            lieu_entretien=form.lieu,
            status="en attente"
        )
        db.add(convocation)
        db.commit()
        db.refresh(convocation)

        return {
            "message": f"✅ Convocation créée pour {nom_complet} (en attente d'envoi)",
            "convocation_id": convocation.id,
            "date_entretien": form.date,
            "heure_entretien": form.heure,
            "lieu_entretien": form.lieu,
            "status": convocation.status
        }

    except Exception as e:
        logger.error(f"❌ Erreur lors de la création de convocation : {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erreur lors de la création : {str(e)}")

# --- Send invitation (PDF + mail) ---
@router.post("/rh/candidatures/{candidature_id}/send-invitation")
def send_invitation(candidature_id: int, db: Session = Depends(get_db)):
    candidature = db.query(Candidature).filter(Candidature.id == candidature_id).first()
    if not candidature:
        raise HTTPException(status_code=404, detail="Candidat introuvable")

    nom_complet = getattr(candidature, "fullname", None) or f"{getattr(candidature, 'prenom', '')} {getattr(candidature, 'nom', '')}".strip() or "Candidat"
    email_candidat = candidature.email
    if not email_candidat:
        raise HTTPException(status_code=400, detail="Email du candidat manquant")

    convocation = db.query(Convocation).filter(Convocation.candidature_id == candidature.id).order_by(Convocation.id.desc()).first()
    if not convocation:
        raise HTTPException(status_code=404, detail="Convocation non trouvée")

    try:
        # Génération PDF
        pdf_path = generate_convocation_pdf(candidature, convocation)
        logger.info(f"✅ Convocation PDF généré : {pdf_path}")

        # SMTP credentials
        sender_email = os.getenv("SMTP_EMAIL")
        sender_password = os.getenv("SMTP_PASSWORD")
        smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
        smtp_port = int(os.getenv("SMTP_PORT", 587))

        if not sender_email or not sender_password:
            logger.error("❌ SMTP credentials non trouvées")
            raise HTTPException(status_code=500, detail="SMTP credentials mankany .env tsy hita")

        # Préparation mail
        message = MIMEMultipart()
        message["Subject"] = "Convocation entretien - CODEL"
        message["From"] = sender_email
        message["To"] = email_candidat

        html_content = f"""
        <html>
        <body>
            <p>Bonjour <strong>{nom_complet}</strong>,</p>
            <p>Vous êtes cordialement invité(e) à votre entretien pour le poste.</p>
            <p><strong>Date et heure :</strong> {convocation.date_entretien} {convocation.heure_entretien}<br>
               <strong>Lieu :</strong> {convocation.lieu_entretien}</p>
            <p>Veuillez consulter le PDF joint pour tous les détails et apporter les documents nécessaires.</p>
            <p><em>Message automatique, ne pas répondre à ce mail.</em></p>
            <p>Cordialement,<br><strong>Équipe RH</strong></p>
        </body>
        </html>
        """
        message.attach(MIMEText(html_content, "html", "utf-8"))

        # Attacher PDF
        with open(pdf_path, "rb") as f:
            part = MIMEBase("application", "octet-stream")
            part.set_payload(f.read())
            encoders.encode_base64(part)
            part.add_header(
                "Content-Disposition",
                f'attachment; filename="{os.path.basename(pdf_path)}"'
            )
            message.attach(part)

        # Envoi via SMTP
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            server.login(sender_email, sender_password)
            server.sendmail(sender_email, email_candidat, message.as_string())

        # Update status convocation
        convocation.status = "envoyée"
        convocation.lien_fichier = pdf_path
        db.commit()

        logger.info(f"✅ Convocation envoyée à {nom_complet} ({email_candidat})")
        return {
            "message": f"Bonjour {nom_complet}, votre convocation a été envoyée avec succès ✅",
            "pdf_path": pdf_path,
            "date_entretien": convocation.date_entretien,
            "heure_entretien": convocation.heure_entretien,
            "lieu_entretien": convocation.lieu_entretien,
            "status": convocation.status
        }

    except Exception as e:
        logger.error(f"❌ Erreur lors de l'envoi de convocation : {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erreur lors de l'envoi : {str(e)}")
