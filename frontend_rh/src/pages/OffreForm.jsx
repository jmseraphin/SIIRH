import { useState } from "react";
import jsPDF from "jspdf";
import logo from "../assets/codel_logo1.png";
import "../styles/OffreForm.css";

export default function OffreForm() {
  const [form, setForm] = useState({
    title: "",
    job_ref: "",
    department: "",
    site: "",
    contract_type: "CDI",
    creation_date: "",
    mission: "",
    activities_public: "",
    goals: "",
    education_level: "",
    exp_required_years: "",
    tech_skills: "",
    soft_skills: "",
    langs_lvl: "",
    w_skills: 0.4,
    w_exp: 0.3,
    w_edu: 0.2,
    w_proj: 0.1,
    threshold: 60,
    scoring_config_path: "/configs/scoring_default.json",
    deadline: "",
    apply_link: "",
  });

  const [generatedText, setGeneratedText] = useState("");

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === "number") setForm({ ...form, [name]: parseFloat(value) });
    else setForm({ ...form, [name]: value });
  };

  const handleGenerate = () => {
    const text = `
Offre d’emploi: ${form.title || "{TITLE}"}
Référence du poste: ${form.job_ref || "{JOB_REF}"}
Département / Service: ${form.department || "{DEPARTMENT}"}
Lieu: ${form.site || "{SITE}"}
Type de contrat: ${form.contract_type || "{CONTRACT_TYPE}"}
Date de création: ${form.creation_date || "{CREATION_DATE}"}

Description du poste:
${form.mission || "Le/la candidat(e) participera au développement et à la maintenance des applications internes et externes de l’entreprise, en collaboration avec l’équipe technique et les chefs de projet. Il/elle contribuera à l’optimisation des performances, à la sécurité et à la qualité globale des solutions informatiques."}

Responsabilités principales:
${form.activities_public || "• Concevoir et développer des fonctionnalités selon les besoins exprimés\n• Participer aux réunions de suivi et de planification\n• Assurer la maintenance et l’optimisation du code existant\n• Collaborer avec les équipes transverses pour garantir la qualité et la cohérence des projets\n• Rédiger la documentation technique et les guides d’utilisation"}

Objectifs du poste:
${form.goals || "Assurer la livraison des projets dans les délais impartis, maintenir un niveau élevé de qualité et contribuer à l’amélioration continue des processus de développement."}

Profil recherché:
Éducation: ${form.education_level || "Bac+3 ou équivalent en informatique"}
Expérience: ${form.exp_required_years || "3"} ans minimum
Compétences techniques: ${form.tech_skills || "React, Node.js, SQL, API REST"}
Compétences comportementales: ${form.soft_skills || "Communication, esprit d’équipe, autonomie, sens de l’organisation"}
Langues: ${form.langs_lvl || "Français (courant), Anglais (intermédiaire)"}

Conditions & candidatures:
Date limite: ${form.deadline || "{DEADLINE}"}
Lien pour postuler: ${form.apply_link || "https://candidature.siirh.mg"}
`;
    setGeneratedText(text);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form };
    const res = await fetch("http://127.0.0.1:8000/api/offres", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      alert("✅ Offre publiée avec succès !");
      setGeneratedText("");
    } else {
      alert("⚠️ Erreur lors de la publication.");
    }
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 20;

    // === PAGE 1: Logo sy titre ===
    const imgHeight = 15;
    const imgWidth = 60;
    doc.addImage(logo, "PNG", (pageWidth - imgWidth) / 2, 10, imgWidth, imgHeight);
    y += imgHeight + 5;

    doc.setFontSize(16);
    doc.text("OFFRE D'EMPLOI SIIRH", pageWidth / 2, y, { align: "center" });
    y += 12;

    // === TEXTE ===
    doc.setFontSize(12);
    const lines = generatedText.split("\n");
    lines.forEach((line) => {
      const splitLines = doc.splitTextToSize(line, pageWidth - 30);
      splitLines.forEach((sline) => {
        if (y > 270) {
          doc.addPage();
          y = 20; // mitohy tsy misy logo sy titre intsony
        }
        doc.text(sline, 15, y);
        y += 7;
      });
    });

    // === SIGNATURE ===
    if (y > 240) {
      doc.addPage();
      y = 20;
    }
    y += 20;
    doc.setFontSize(12);
    doc.text("Signature / Cachet: _________________________", 15, y + 10);

    doc.save(`${form.job_ref || "offre"}_SIIRH.pdf`);
  };

  return (
    <div className="offre-form-container">
      <h2 className="title">Publier une nouvelle offre — SIIRH</h2>
      <form className="offre-form" onSubmit={handleSubmit}>
        <label>Intitulé du poste</label>
        <input name="title" value={form.title} onChange={handleChange} placeholder="Ex: Développeur Fullstack" required />

        <label>Référence interne</label>
        <input name="job_ref" value={form.job_ref} onChange={handleChange} placeholder="Ex: OFF-2025-001" required />

        <label>Département / Service</label>
        <input name="department" value={form.department} onChange={handleChange} placeholder="Ex: Informatique / Développement" />

        <label>Localisation</label>
        <input name="site" value={form.site} onChange={handleChange} placeholder="Ex: Antananarivo" />

        <label>Type de contrat</label>
        <select name="contract_type" value={form.contract_type} onChange={handleChange}>
          <option value="CDI">CDI</option>
          <option value="CDD">CDD</option>
          <option value="Stage">Stage</option>
          <option value="Freelance">Freelance</option>
        </select>

        <label>Date de création</label>
        <input type="date" name="creation_date" value={form.creation_date} onChange={handleChange} />

        <label>Résumé / Mission principale</label>
        <textarea name="mission" value={form.mission} onChange={handleChange} placeholder="Décrivez la mission principale..." />

        <label>Responsabilités principales</label>
        <textarea name="activities_public" value={form.activities_public} onChange={handleChange} placeholder="Décrivez les responsabilités..." />

        <label>Objectifs du poste</label>
        <textarea name="goals" value={form.goals} onChange={handleChange} placeholder="Décrivez les objectifs du poste..." />

        <label>Niveau d’études requis</label>
        <input name="education_level" value={form.education_level} onChange={handleChange} placeholder="Ex: Bac+3 ou équivalent" />

        <label>Années d’expérience requises</label>
        <input type="number" name="exp_required_years" value={form.exp_required_years} onChange={handleChange} />

        <label>Compétences techniques</label>
        <input name="tech_skills" value={form.tech_skills} onChange={handleChange} placeholder="Ex: React, Node.js, SQL" />

        <label>Compétences comportementales</label>
        <input name="soft_skills" value={form.soft_skills} onChange={handleChange} placeholder="Ex: Communication, esprit d’équipe" />

        <label>Langues et niveaux</label>
        <input name="langs_lvl" value={form.langs_lvl} onChange={handleChange} placeholder="Ex: Français (courant), Anglais (intermédiaire)" />

        {/* Poids (backend use only) */}
        <label>Poids Compétences (%) : {Math.round(form.w_skills * 100)}</label>
        <input type="range" min="0" max="1" step="0.01" name="w_skills" value={form.w_skills} onChange={handleChange} />

        <label>Poids Expérience (%) : {Math.round(form.w_exp * 100)}</label>
        <input type="range" min="0" max="1" step="0.01" name="w_exp" value={form.w_exp} onChange={handleChange} />

        <label>Poids Études (%) : {Math.round(form.w_edu * 100)}</label>
        <input type="range" min="0" max="1" step="0.01" name="w_edu" value={form.w_edu} onChange={handleChange} />

        <label>Poids Projets (%) : {Math.round(form.w_proj * 100)}</label>
        <input type="range" min="0" max="1" step="0.01" name="w_proj" value={form.w_proj} onChange={handleChange} />

        <label>Seuil d’acceptation</label>
        <input type="number" name="threshold" value={form.threshold} onChange={handleChange} />

        <label>Date limite de candidature</label>
        <input type="date" name="deadline" value={form.deadline} onChange={handleChange} />

        <label>Lien pour postuler</label>
        <input name="apply_link" value={form.apply_link} onChange={handleChange} placeholder="Ex: https://candidature.siirh.mg" />

        <div className="button-group">
          <button type="button" onClick={handleGenerate} className="generate-btn">Générer l’offre</button>
          <button type="submit" className="publish-btn">Publier l’offre</button>
          <button type="button" onClick={handleExportPDF} className="export-btn">Exporter en PDF</button>
        </div>

        {generatedText && (
          <div className="offre-preview">
            <textarea value={generatedText} readOnly />
          </div>
        )}
      </form>
    </div>
  );
}



