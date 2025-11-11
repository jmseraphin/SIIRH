// import React, { useState } from "react";
// import "./../styles/ConvocationForm.css";

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
//     setMessage("Envoi de la convocation en cours...");

//     try {
//       const response = await fetch(
//         `http://localhost:8000/rh/candidatures/${candidatId}/send-invitation`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(formData),
//         }
//       );

//       if (!response.ok) throw new Error("Erreur serveur");

//       setMessage("✅ Convocation envoyée avec succès !");
//       setFormData({ date: "", heure: "", lieu: "" });
//     } catch (err) {
//       console.error(err);
//       setMessage("❌ Erreur lors de l’envoi de la convocation.");
//     }
//   };

//   return (
//     <div className="convocation-container">
//       <h2>Envoyer une convocation</h2>
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

//         <button type="submit">Envoyer la convocation</button>
//       </form>

//       {message && <p className="status-message">{message}</p>}
//     </div>
//   );
// }

// export default ConvocationForm;



import React, { useState } from "react";
import "../styles/ConvocationForm.css";

function ConvocationForm({ candidatId }) {
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
    setMessage("⏳ Enregistrement de la convocation en cours...");

    try {
      const response = await fetch(
        `http://localhost:8000/rh/candidatures/${candidatId}/create-convocation`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error("Erreur lors de l’enregistrement");

      const data = await response.json();
      setMessage("✅ Convocation enregistrée avec succès (en attente d'envoi)");
      console.log("Convocation enregistrée :", data);

      // Vider le formulaire après succès
      setFormData({ date: "", heure: "", lieu: "" });
    } catch (err) {
      console.error("Erreur :", err);
      setMessage("❌ Erreur lors de l’enregistrement de la convocation.");
    }
  };

  return (
    <div className="convocation-container">
      <h2>Créer une convocation</h2>
      <form onSubmit={handleSubmit} className="convocation-form">
        <label>Date de l'entretien :</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />

        <label>Heure :</label>
        <input
          type="time"
          name="heure"
          value={formData.heure}
          onChange={handleChange}
          required
        />

        <label>Lieu de l'entretien :</label>
        <input
          type="text"
          name="lieu"
          placeholder="Ex : Siège CODEL - Antananarivo"
          value={formData.lieu}
          onChange={handleChange}
          required
        />

        <button type="submit">💾 Enregistrer</button>
      </form>

      {message && <p className="status-message">{message}</p>}
    </div>
  );
}

export default ConvocationForm;


