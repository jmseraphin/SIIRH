from dotenv import load_dotenv
import os
import smtplib

# 🔹 Charge .env (làlana mankany amin'ny backend/app/.env)
load_dotenv(dotenv_path="../.env")  # satria ao amin'ny 'routers' ny script

# 🔹 Maka variables
sender_email = os.getenv("SMTP_EMAIL")
sender_password = os.getenv("SMTP_PASSWORD")
smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
smtp_port = int(os.getenv("SMTP_PORT", 587))

print("EMAIL:", sender_email)
print("PASSWORD:", sender_password[:4] + "****" if sender_password else "None")

# 🔹 Fitsapana login SMTP
try:
    if not sender_email or not sender_password:
        raise ValueError("SMTP_EMAIL or SMTP_PASSWORD is None")
    
    server = smtplib.SMTP(smtp_server, smtp_port)
    server.starttls()
    server.login(sender_email, sender_password)
    print("✅ Login SMTP réussi !")
    server.quit()
except Exception as e:
    print("❌ Erreur SMTP:", e)
