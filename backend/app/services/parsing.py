from docx import Document
import pdfplumber
import re
import json

# --- 1. Parser ny DOCX ---
def parse_docx(path: str) -> str:
    doc = Document(path)
    text = "\n".join([p.text for p in doc.paragraphs if p.text.strip()])
    return text

# --- 2. Parser ny PDF ---
def parse_pdf(path: str) -> str:
    text = ""
    with pdfplumber.open(path) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    return text

# --- 3. Extract info avy amin'ny text ---
def extract_info(text: str) -> dict:
    # Email
    email = re.search(r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b", text)

    # Téléphone
    phone = re.search(r"\+?\d[\d\s().-]{7,}", text)

    # Nom & Prénom (simpliste: mitady teny roa voalohany mitovy amin'ny "Nom Prénom")
    name_match = re.findall(r"([A-Z][a-z]+)", text)
    firstname, lastname = (name_match[0], name_match[1]) if len(name_match) >= 2 else (None, None)

    # Compétences (mila liste pré-définie)
    skill_keywords = [
        "Python", "Django", "FastAPI", "React", "SQL", "Docker", "Kubernetes",
        "Machine Learning", "Data Analysis", "Excel", "Communication", "Leadership"
    ]
    skills = [kw for kw in skill_keywords if re.search(rf"\b{kw}\b", text, re.IGNORECASE)]

    # Diplômes
    diploma_keywords = ["Licence", "Master", "Doctorat", "Ingénieur", "Bachelor"]
    diplomes = [d for d in diploma_keywords if re.search(rf"\b{d}\b", text, re.IGNORECASE)]

    # Langues
    langues_keywords = ["Français", "Anglais", "Espagnol", "Allemand", "Italien", "Malgache"]
    langues = [l for l in langues_keywords if re.search(rf"\b{l}\b", text, re.IGNORECASE)]

    # Expériences (mitady taona)
    exp_years_match = re.findall(r"(\d+)\s+(ans|années|an)", text.lower())
    exp_years = max([int(e[0]) for e in exp_years_match], default=0)

    return {
        "firstname": firstname,
        "lastname": lastname,
        "email": email.group() if email else None,
        "phone": phone.group() if phone else None,
        "skills": skills,
        "diplomes": diplomes,
        "langues": langues,
        "exp_years": exp_years,
        "raw_text": text[:1000]  # Tehirizina 1000 caractères fotsiny ho famintinana
    }

# --- 4. Scoring automatique ---
def score_candidate(parsed_json: dict, job_requirements: dict) -> float:
    skills_required = set(job_requirements.get("skills", []))
    skills_candidate = set(parsed_json.get("skills", []))
    match_skills = len(skills_candidate & skills_required) / max(len(skills_required), 1)

    exp_score = min(parsed_json.get("exp_years", 0) / job_requirements.get("exp_years", 1), 1)

    score_total = 0.7 * match_skills + 0.3 * exp_score
    return round(score_total * 100, 2)

# --- 5. Debug/Test local ---
if __name__ == "__main__":
    sample_text = """
    Jean Dupont
    Email: jean.dupont@example.com
    Téléphone: +261 34 12 345 67
    Expérience: 5 ans en Python, FastAPI, React
    Diplôme: Master en Informatique
    Langues: Français, Anglais
    """
    parsed = extract_info(sample_text)
    job_req = {"skills": ["Python", "FastAPI"], "exp_years": 3}
    print("Parsed JSON:", json.dumps(parsed, indent=2, ensure_ascii=False))
    print("Score:", score_candidate(parsed, job_req))
