import re
import json

def parse_cv_text(cv_text: str) -> dict:
    """
    Parse texte brut d’un CV pour extraire les infos principales :
    - competences
    - experience (en années)
    - diplome
    - projets

    Retourne un dictionnaire JSON compatible avec calculate_score().
    """

    # 🔹 Normalisation du texte
    text = cv_text.lower()

    # 🔹 Liste de mots-clés compétences communes (extensible)
    competences_keywords = [
        "python", "fastapi", "sql", "docker", "git", "javascript", "react", "html", "css",
        "linux", "windows", "machine learning", "pandas", "excel", "finance",
        "gestion de projet", "communication", "networking", "cloud", "powerbi",
        "recrutement", "formation", "paie"
    ]

    competences_trouvees = [c for c in competences_keywords if c in text]

    # 🔹 Expérience (nombre d’années détecté)
    exp_annees = 0
    exp_match = re.findall(r"(\d+)\s*(?:ans|an|année|années)", text)
    if exp_match:
        exp_annees = max([int(x) for x in exp_match if x.isdigit()] + [0])

    # 🔹 Diplôme (simplifié)
    diplome_match = None
    if "master" in text:
        diplome_match = "Master Informatique"
    elif "licence" in text:
        diplome_match = "Licence Informatique"
    elif "ingénieur" in text:
        diplome_match = "Diplôme d’Ingénieur"
    elif "bachelor" in text:
        diplome_match = "Bachelor"
    elif "doctorat" in text:
        diplome_match = "Doctorat"
    else:
        diplome_match = "Autre"

    # 🔹 Projets (mots-clés simples)
    projets = []
    for line in text.splitlines():
        if "projet" in line or "application" in line:
            projets.append(line.strip()[:120])  # tronqué pour éviter le texte long

    # 🔹 Construction du JSON final
    parsed_json = {
        "competences": list(set(competences_trouvees)),
        "experience_annees": exp_annees,
        "diplome": diplome_match,
        "projets": projets[:5],  # limiter à 5 projets
    }

    return parsed_json
