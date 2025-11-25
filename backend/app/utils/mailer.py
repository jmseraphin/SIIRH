import smtplib
from email.message import EmailMessage
import mimetypes
import os
from dotenv import load_dotenv

# Charger variables .env
load_dotenv()

SMTP_SERVER = os.getenv("SMTP_SERVER")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SMTP_USERNAME = os.getenv("SMTP_EMAIL")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")

def send_mail(to: str, subject: str, body: str, attachments: list = None):
    """
    Envoi d'email avec pièces jointes
    - utilise config du fichier .env
    - support PDF, images, etc.
    """

    if not SMTP_USERNAME or not SMTP_PASSWORD:
        raise Exception("SMTP_EMAIL ou SMTP_PASSWORD manjavona ao amin'ny .env")

    msg = EmailMessage()
    msg["From"] = SMTP_USERNAME
    msg["To"] = to
    msg["Subject"] = subject
    msg.set_content(body)

    # Ajouter pièces jointes
    if attachments:
        for file_path in attachments:
            if not os.path.exists(file_path):
                print(f"[MAILER] Fichier introuvable: {file_path}")
                continue

            mime_type, _ = mimetypes.guess_type(file_path)
            mime_main, mime_sub = mime_type.split("/")

            with open(file_path, "rb") as f:
                msg.add_attachment(
                    f.read(),
                    maintype=mime_main,
                    subtype=mime_sub,
                    filename=os.path.basename(file_path)
                )

    try:
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USERNAME, SMTP_PASSWORD)
            server.send_message(msg)

        print("[MAILER] Email envoyé avec succès")

    except Exception as e:
        print("[MAILER] Erreur:", e)
        raise e
