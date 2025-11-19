// import React, { useState } from "react";
// import "../styles/ConvocationForm.css";

// function ConvocationForm({ candidatId }) {
//   const [formData, setFormData] = useState({
//     date: "",
//     heure: "",
//     lieu: "",
//   });
//   const [message, setMessage] = useState("");

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage("⏳ Enregistrement de la convocation en cours...");

//     try {
//       const response = await fetch(
//         `http://localhost:8000/rh/candidatures/${candidatId}/create-convocation`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(formData),
//         }
//       );

//       if (!response.ok) throw new Error("Erreur lors de l’enregistrement");

//       const data = await response.json();
//       setMessage("✅ Convocation enregistrée avec succès (en attente d'envoi)");
//       console.log("Convocation enregistrée :", data);

//       // Vider le formulaire après succès
//       setFormData({ date: "", heure: "", lieu: "" });
//     } catch (err) {
//       console.error("Erreur :", err);
//       setMessage("❌ Erreur lors de l’enregistrement de la convocation.");
//     }
//   };

//   return (
//     <div className="convocation-container">
//       <h2>Créer une convocation</h2>
//       <form onSubmit={handleSubmit} className="convocation-form">
//         <label>Date de l'entretien :</label>
//         <input
//           type="date"
//           name="date"
//           value={formData.date}
//           onChange={handleChange}
//           required
//         />

//         <label>Heure :</label>
//         <input
//           type="time"
//           name="heure"
//           value={formData.heure}
//           onChange={handleChange}
//           required
//         />

//         <label>Lieu de l'entretien :</label>
//         <input
//           type="text"
//           name="lieu"
//           placeholder="Ex : Siège CODEL - Antananarivo"
//           value={formData.lieu}
//           onChange={handleChange}
//           required
//         />

//         <button type="submit">💾 Enregistrer</button>
//       </form>

//       {message && <p className="status-message">{message}</p>}
//     </div>
//   );
// }

// export default ConvocationForm;

















import React, { useState } from "react";
import "../styles/ConvocationForm.css";

function ConvocationForm({ candidatId, caseId, type = "candidature", onSuccess }) {
  const [formData, setFormData] = useState({
    date: "",
    heure: "",
    lieu: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("⏳ Génération de la convocation en cours...");

    try {
      let url = "";

      if (type === "candidature") {
        url = `http://localhost:8000/rh/candidatures/${candidatId}/create-convocation`;
      } else if (type === "discipline") {
        url = `http://localhost:8000/discipline/cases/${caseId}/convocation`;
      } else {
        throw new Error("Type invalide");
      }

      const payload =
        type === "candidature"
          ? formData
          : {
              date_entretien: formData.date,
              heure_entretien: formData.heure,
              lieu_entretien: formData.lieu,
            };

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Erreur lors de l’enregistrement");

      const data = await response.json();
      setMessage(
        type === "candidature"
          ? "✅ Convocation enregistrée avec succès (en attente d'envoi)"
          : "✅ Convocation Discipline générée avec succès !"
      );
      console.log("Convocation :", data);

      // Ouvrir PDF direct si Discipline
      if (type === "discipline" && data.pdf_url) window.open(data.pdf_url, "_blank");

      // Vider le formulaire
      setFormData({ date: "", heure: "", lieu: "" });

      if (onSuccess) onSuccess(); // callback pour refresh
    } catch (err) {
      console.error("Erreur :", err);
      setMessage("❌ Erreur lors de la génération de la convocation.");
    }
  };

  return (
    <div className="convocation-container">
      <h2>
        {type === "candidature" ? "Créer une convocation" : "Créer une convocation (Discipline)"}
      </h2>
      <form onSubmit={handleSubmit} className="convocation-form">
        <label>Date :</label>
        <input type="date" name="date" value={formData.date} onChange={handleChange} required />

        <label>Heure :</label>
        <input type="time" name="heure" value={formData.heure} onChange={handleChange} required />

        <label>Lieu :</label>
        <input
          type="text"
          name="lieu"
          placeholder="Ex : Siège CODEL - Antananarivo"
          value={formData.lieu}
          onChange={handleChange}
          required
        />

        <button type="submit">💾 {type === "candidature" ? "Enregistrer" : "Générer PDF"}</button>
      </form>

      {message && <p className="status-message">{message}</p>}
    </div>
  );
}

export default ConvocationForm;
