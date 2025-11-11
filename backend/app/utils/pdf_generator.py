# pdf_generator.py
from fpdf import FPDF
from datetime import datetime
import os

def generate_convocation_pdf(candidat, convocation):
    """
    Génère un PDF de convocation pour le candidat.
    Reçoit désormais l'objet convocation pour récupérer date, heure et lieu.
    """
    pdf = FPDF()
    pdf.add_page()

    # 🔹 Logo afovoany, mifanakaiky amin'ilay titre
    logo_path = os.path.join("app", "assets", "codel_logo1.png")
    if os.path.exists(logo_path):
        page_width = pdf.w - 2 * pdf.l_margin
        logo_width = 33
        x_logo = (page_width - logo_width) / 2 + pdf.l_margin
        pdf.image(logo_path, x=x_logo, y=30, w=logo_width)
    pdf.ln(55)

    # 🔹 Titre
    pdf.set_font("Arial", "B", 16)
    pdf.cell(0, 10, "Convocation à l'entretien", ln=True, align="C")
    pdf.ln(12)

    # 🔹 Corps du texte
    pdf.set_font("Arial", "", 12)
    nom_complet = getattr(candidat, "fullname", None) or f"{getattr(candidat, 'prenom', '')} {getattr(candidat, 'nom', '')}".strip() or "Candidat"
    poste = getattr(candidat, "poste", "poste non défini")

    date_entretien = getattr(convocation, "date_entretien", "à définir")
    heure_entretien = getattr(convocation, "heure_entretien", "à définir")
    lieu_entretien = getattr(convocation, "lieu_entretien", "à définir")

    corps = f"""
Bonjour {nom_complet},

Vous êtes cordialement invité(e) à notre entretien pour le poste de {poste}.

Date de l'entretien : {date_entretien}
Heure : {heure_entretien}
Lieu : {lieu_entretien}

Veuillez apporter tous les documents nécessaires.

Cordialement,
Équipe RH
"""
    pdf.multi_cell(0, 8, corps)
    pdf.ln(15)

    # 🔹 Date automatique (Antananarivo, le …) 
    date_str = datetime.now().strftime("Antananarivo, le %d %B %Y")
    pdf.set_font("Arial", "I", 11)
    pdf.cell(0, 10, date_str, ln=True, align="L")
    pdf.ln(5)

    # 🔹 Message automatique — manga, afovoany tsara
    pdf.set_text_color(0, 0, 200)
    pdf.set_font("Arial", "I", 11)
    pdf.cell(0, 10, "Document généré automatiquement - Ne pas répondre à ce message", ln=True, align="C")

    # 🔹 Reset couleur raha ilaina
    pdf.set_text_color(0, 0, 0)

    # 🔹 Sauvegarde PDF
    file_path = f"/tmp/convocation_{candidat.id}.pdf"
    pdf.output(file_path, 'F')
    return file_path
