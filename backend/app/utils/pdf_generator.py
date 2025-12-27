# from fpdf import FPDF
# from datetime import datetime
# import os

# # ==========================================================
# #   PDF CONVOCATION ENTRETIEN (déjà existant, tsy mikitika)
# # ==========================================================
# def generate_convocation_pdf(candidat, convocation):
#     pdf = FPDF()
#     pdf.add_page()

#     # Logo
#     logo_path = os.path.join("app", "assets", "codel_logo1.png")
#     if os.path.exists(logo_path):
#         page_width = pdf.w - 2 * pdf.l_margin
#         logo_width = 33
#         x_logo = (page_width - logo_width) / 2 + pdf.l_margin
#         pdf.image(logo_path, x=x_logo, y=30, w=logo_width)
#     pdf.ln(55)

#     # Title
#     pdf.set_font("Arial", "B", 16)
#     pdf.cell(0, 10, "Convocation à l'entretien", ln=True, align="C")
#     pdf.ln(12)

#     # Content
#     pdf.set_font("Arial", "", 12)
#     nom_complet = getattr(candidat, "fullname", None) or \
#                   f"{getattr(candidat, 'prenom', '')} {getattr(candidat, 'nom', '')}".strip() \
#                   or "Candidat"
#     poste = getattr(candidat, "poste", "poste non défini")

#     date_entretien = convocation.get("date_entretien", "à définir")
#     heure_entretien = convocation.get("heure_entretien", "à définir")
#     lieu_entretien = convocation.get("lieu_entretien", "à définir")

#     corps = f"""
# Bonjour {nom_complet},

# Vous êtes cordialement invité(e) à notre entretien pour le poste de {poste}.

# Date de l'entretien : {date_entretien}
# Heure : {heure_entretien}
# Lieu : {lieu_entretien}

# Veuillez apporter tous les documents nécessaires.

# Cordialement,
# Équipe RH
# """
#     pdf.multi_cell(0, 8, corps)
#     pdf.ln(15)

#     # Footer date
#     date_str = datetime.now().strftime("Antananarivo, le %d %B %Y")
#     pdf.set_font("Arial", "I", 11)
#     pdf.cell(0, 10, date_str, ln=True)
#     pdf.ln(5)

#     # Footer info
#     pdf.set_text_color(0, 0, 200)
#     pdf.set_font("Arial", "I", 11)
#     pdf.cell(0, 10, "Document généré automatiquement - Ne pas répondre à ce message", ln=True, align="C")
#     pdf.set_text_color(0, 0, 0)

#     # File with timestamp
#     timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
#     file_path = f"/tmp/convocation_{candidat.id}_{timestamp}.pdf"
#     pdf.output(file_path, 'F')
#     return file_path

# # ==========================================================
# #   PDF CONVOCATION DISCIPLINE (nouveau, tsy manimba entretien)
# # ==========================================================
# def generate_convocation_discipline_pdf(candidat, convocation):
#     pdf = FPDF()
#     pdf.add_page()

#     # Logo
#     logo_path = os.path.join("app", "assets", "codel_logo1.png")
#     if os.path.exists(logo_path):
#         page_width = pdf.w - 2 * pdf.l_margin
#         logo_width = 33
#         x_logo = (page_width - logo_width) / 2 + pdf.l_margin
#         pdf.image(logo_path, x=x_logo, y=30, w=logo_width)
#     pdf.ln(55)

#     # Title
#     pdf.set_font("Arial", "B", 16)
#     titre = f"Convocation disciplinaire - {getattr(candidat, 'fault_type', '') or 'Faute'}"
#     pdf.cell(0, 10, titre, ln=True, align="C")
#     pdf.ln(12)

#    # Content
#     pdf.set_font("Arial", "", 12)
#     nom_complet = getattr(candidat, "fullname", None) or \
#                   f"{getattr(candidat, 'prenom', '')} {getattr(candidat, 'nom', '')}".strip() \
#                   or "Employé"
#     type_faute = convocation.get("fault_type", "à définir")
#     date_conv = convocation.get("date_convocation", "à définir")
#     heure_conv = convocation.get("heure_convocation", "à définir")
#     lieu_conv = convocation.get("lieu_convocation", "à définir")

#     corps = f"""
# Bonjour {nom_complet},

# Vous êtes convoqué(e) à une convocation disciplinaire concernant : {type_faute}.

# Date : {date_conv}
# Heure : {heure_conv}
# Lieu : {lieu_conv}

# Veuillez vous présenter avec tous les documents nécessaires et préparer vos explications.

# Cordialement,
# Équipe RH
# """
#     pdf.multi_cell(0, 8, corps)
#     pdf.ln(15)

#     # Footer date
#     date_str = datetime.now().strftime("..........................., le %d %B %Y")
#     pdf.set_font("Arial", "I", 11)
#     pdf.cell(0, 10, date_str, ln=True)
#     pdf.ln(5)



#     # File with timestamp
#     timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
#     file_path = f"/tmp/convocation_discipline_{candidat.id}_{timestamp}.pdf"
#     pdf.output(file_path, 'F')
#     return file_path

# # ==========================================================
# #   PDF DECISION DISCIPLINAIRE
# # ==========================================================
# def generate_decision_pdf(candidat, decision):
#     pdf = FPDF()
#     pdf.add_page()

#     pdf.set_font("Arial", "B", 16)
#     pdf.cell(0, 10, "Décision disciplinaire", ln=True, align="C")
#     pdf.ln(10)

#     nom_complet = getattr(candidat, "fullname", None) or \
#                   f"{getattr(candidat, 'prenom','')} {getattr(candidat,'nom','')}".strip() \
#                   or "Candidat"

#     pdf.set_font("Arial", "", 12)
#     pdf.multi_cell(
#         0, 8,
#         f"Employé : {nom_complet}\n"
#         f"Sazy : {decision.decision_type}\n"
#         f"Fanazavana : {decision.decision_notes}"
#     )
#     pdf.ln(15)

#     date_str = datetime.now().strftime("Antananarivo, le %d %B %Y")
#     pdf.set_font("Arial", "I", 11)
#     pdf.cell(0, 10, date_str, ln=True)

#     timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
#     file_path = f"/tmp/decision_{candidat.id}_{timestamp}.pdf"
#     pdf.output(file_path, 'F')
#     return file_path

# # ==========================================================
# #   PDF LETTRE DE LICENCIEMENT
# # ==========================================================
# def generate_licenciement_letter(candidat, data):
#     pdf = FPDF()
#     pdf.add_page()

#     # Title
#     pdf.set_font("Arial", "B", 16)
#     pdf.cell(0, 10, "Lettre de licenciement", ln=True, align="C")
#     pdf.ln(12)

#     # Employee
#     nom_complet = getattr(candidat, "fullname", None) or \
#                   f"{getattr(candidat, 'prenom','')} {getattr(candidat,'nom','')}".strip() \
#                   or "Candidat"

#     pdf.set_font("Arial", "", 12)

#     motif = data.get("motif", "Non précisé") if data else "Non précisé"
#     date_effet = data.get("date", datetime.now().strftime("%d/%m/%Y")) if data else datetime.now().strftime("%d/%m/%Y")

#     corps = f"""
# Madame/Monsieur {nom_complet},

# Par la présente, nous vous informons officiellement de votre licenciement.

# Motif : {motif}
# Date d’effet : {date_effet}

# Vous serez contacté(e) par le service RH pour les formalités administratives.

# Cordialement,
# Équipe RH
# """
#     pdf.multi_cell(0, 8, corps)

#     pdf.ln(10)
#     date_str = datetime.now().strftime("Antananarivo, le %d %B %Y")
#     pdf.set_font("Arial", "I", 11)
#     pdf.cell(0, 10, date_str, ln=True)

#     timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
#     file_path = f"/tmp/lettre_licenciement_{candidat.id}_{timestamp}.pdf"
#     pdf.output(file_path, 'F')
#     return file_path












from fpdf import FPDF
from datetime import datetime
import os

# ==========================================================
#   PDF CONVOCATION ENTRETIEN (déjà existant, tsy mikitika)
# ==========================================================
def generate_convocation_pdf(candidat, convocation):
    pdf = FPDF()
    pdf.add_page()

    # Logo
    logo_path = os.path.join("app", "assets", "codel_logo1.png")
    if os.path.exists(logo_path):
        page_width = pdf.w - 2 * pdf.l_margin
        logo_width = 33
        x_logo = (page_width - logo_width) / 2 + pdf.l_margin
        pdf.image(logo_path, x=x_logo, y=30, w=logo_width)
    pdf.ln(55)

    # Title
    pdf.set_font("Arial", "B", 16)
    pdf.cell(0, 10, "Convocation à l'entretien", ln=True, align="C")
    pdf.ln(12)

    # Content
    pdf.set_font("Arial", "", 12)
    nom_complet = getattr(candidat, "fullname", None) or \
                  f"{getattr(candidat, 'prenom', '')} {getattr(candidat, 'nom', '')}".strip() \
                  or "Candidat"
    poste = getattr(candidat, "poste", "poste non défini")

    # Soloina .get() amin'ny getattr()
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

    # Footer date
    date_str = datetime.now().strftime("Antananarivo, le %d %B %Y")
    pdf.set_font("Arial", "I", 11)
    pdf.cell(0, 10, date_str, ln=True)
    pdf.ln(5)

    # Footer info
    pdf.set_text_color(0, 0, 200)
    pdf.set_font("Arial", "I", 11)
    pdf.cell(0, 10, "Document généré automatiquement - Ne pas répondre à ce message", ln=True, align="C")
    pdf.set_text_color(0, 0, 0)

    # File with timestamp
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    file_path = f"/tmp/convocation_{candidat.id}_{timestamp}.pdf"
    pdf.output(file_path, 'F')
    return file_path

# ==========================================================
#   PDF CONVOCATION DISCIPLINE (nouveau, tsy manimba entretien)
# ==========================================================
def generate_convocation_discipline_pdf(candidat, convocation):
    pdf = FPDF()
    pdf.add_page()

    # Logo
    logo_path = os.path.join("app", "assets", "codel_logo1.png")
    if os.path.exists(logo_path):
        page_width = pdf.w - 2 * pdf.l_margin
        logo_width = 33
        x_logo = (page_width - logo_width) / 2 + pdf.l_margin
        pdf.image(logo_path, x=x_logo, y=30, w=logo_width)
    pdf.ln(55)

    # Title
    pdf.set_font("Arial", "B", 16)
    titre = f"Convocation disciplinaire - {getattr(candidat, 'fault_type', '') or 'Faute'}"
    pdf.cell(0, 10, titre, ln=True, align="C")
    pdf.ln(12)

   # Content
    pdf.set_font("Arial", "", 12)
    nom_complet = getattr(candidat, "fullname", None) or \
                  f"{getattr(candidat, 'prenom', '')} {getattr(candidat, 'nom', '')}".strip() \
                  or "Employé"
    type_faute = getattr(convocation, "fault_type", "à définir")
    date_conv = getattr(convocation, "date_convocation", "à définir")
    heure_conv = getattr(convocation, "heure_convocation", "à définir")
    lieu_conv = getattr(convocation, "lieu_convocation", "à définir")

    corps = f"""
Bonjour {nom_complet},

Vous êtes convoqué(e) à une convocation disciplinaire concernant : {type_faute}.

Date : {date_conv}
Heure : {heure_conv}
Lieu : {lieu_conv}

Veuillez vous présenter avec tous les documents nécessaires et préparer vos explications.

Cordialement,
Équipe RH
"""
    pdf.multi_cell(0, 8, corps)
    pdf.ln(15)

    # Footer date
    date_str = datetime.now().strftime("..........................., le %d %B %Y")
    pdf.set_font("Arial", "I", 11)
    pdf.cell(0, 10, date_str, ln=True)
    pdf.ln(5)

    # File with timestamp
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    file_path = f"/tmp/convocation_discipline_{candidat.id}_{timestamp}.pdf"
    pdf.output(file_path, 'F')
    return file_path

# ==========================================================
#   PDF DECISION DISCIPLINAIRE
# ==========================================================
def generate_decision_pdf(candidat, decision):
    pdf = FPDF()
    pdf.add_page()

    pdf.set_font("Arial", "B", 16)
    pdf.cell(0, 10, "Décision disciplinaire", ln=True, align="C")
    pdf.ln(10)

    nom_complet = getattr(candidat, "fullname", None) or \
                  f"{getattr(candidat, 'prenom','')} {getattr(candidat,'nom','')}".strip() \
                  or "Candidat"

    pdf.set_font("Arial", "", 12)
    pdf.multi_cell(
        0, 8,
        f"Employé : {nom_complet}\n"
        f"Sazy : {getattr(decision, 'decision_type', '—')}\n"
        f"Fanazavana : {getattr(decision, 'decision_notes', '—')}"
    )
    pdf.ln(15)

    date_str = datetime.now().strftime("Antananarivo, le %d %B %Y")
    pdf.set_font("Arial", "I", 11)
    pdf.cell(0, 10, date_str, ln=True)

    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    file_path = f"/tmp/decision_{candidat.id}_{timestamp}.pdf"
    pdf.output(file_path, 'F')
    return file_path

# ==========================================================
#   PDF LETTRE DE LICENCIEMENT
# ==========================================================
def generate_licenciement_letter(candidat, data):
    pdf = FPDF()
    pdf.add_page()

    # Title
    pdf.set_font("Arial", "B", 16)
    pdf.cell(0, 10, "Lettre de licenciement", ln=True, align="C")
    pdf.ln(12)

    # Employee
    nom_complet = getattr(candidat, "fullname", None) or \
                  f"{getattr(candidat, 'prenom','')} {getattr(candidat,'nom','')}".strip() \
                  or "Candidat"

    pdf.set_font("Arial", "", 12)

    motif = data.get("motif", "Non précisé") if data else "Non précisé"
    date_effet = data.get("date", datetime.now().strftime("%d/%m/%Y")) if data else datetime.now().strftime("%d/%m/%Y")

    corps = f"""
Madame/Monsieur {nom_complet},

Par la présente, nous vous informons officiellement de votre licenciement.

Motif : {motif}
Date d’effet : {date_effet}

Vous serez contacté(e) par le service RH pour les formalités administratives.

Cordialement,
Équipe RH
"""
    pdf.multi_cell(0, 8, corps)

    pdf.ln(10)
    date_str = datetime.now().strftime("Antananarivo, le %d %B %Y")
    pdf.set_font("Arial", "I", 11)
    pdf.cell(0, 10, date_str, ln=True)

    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    file_path = f"/tmp/lettre_licenciement_{candidat.id}_{timestamp}.pdf"
    pdf.output(file_path, 'F')
    return file_path
