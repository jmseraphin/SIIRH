import React, { useState } from "react";

const CandidatureForm = () => {
  const [lastname, setLastname] = useState("");
  const [firstname, setFirstname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [jobRef, setJobRef] = useState("");
  const [cvFile, setCvFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!cvFile) {
      alert("Veuillez sélectionner un CV !");
      return;
    }

    const formData = new FormData();
    formData.append("job_ref", jobRef);
    formData.append("lastname", lastname);
    formData.append("firstname", firstname);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("cv_file", cvFile); // ✅ Tokony mitovy @ backend
    formData.append(
      "job_requirements",
      JSON.stringify({
        skills: ["Python", "FastAPI"],
        candidate_skills: ["Python"],
        exp_years: 3,
        candidate_exp: 2,
        degree: "Master",
        candidate_degree: "Master",
        projects_score: 15,
      })
    );

    try {
      const response = await fetch(
        "http://localhost:8000/api/recrutement/candidatures",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de l'envoi du CV");
      }

      const data = await response.json();
      // ⚠️ Score ho an’ny RH ihany → ny candidat tsy mahita score
      alert("Candidature envoyée avec succès !");
      console.log("Réponse backend:", data);
    } catch (error) {
      console.error(error);
      alert("Erreur : " + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Nom:</label>
        <input
          type="text"
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Prénom:</label>
        <input
          type="text"
          value={firstname}
          onChange={(e) => setFirstname(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Téléphone:</label>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>
      <div>
        <label>Référence du poste:</label>
        <input
          type="text"
          value={jobRef}
          onChange={(e) => setJobRef(e.target.value)}
          required
        />
      </div>
      <div>
        <label>CV:</label>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => setCvFile(e.target.files[0])}
          required
        />
      </div>
      <button type="submit">Envoyer</button>
    </form>
  );
};

export default CandidatureForm;
