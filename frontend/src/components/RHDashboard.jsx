import React, { useEffect, useState } from "react";

const RHDashboard = () => {
  const [candidatures, setCandidatures] = useState([]);

  useEffect(() => {
    const fetchCandidatures = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/recrutement/candidatures_rh");
        if (!response.ok) throw new Error("Erreur lors du chargement des candidatures");

        const data = await response.json();
        setCandidatures(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCandidatures();
  }, []);

  return (
    <div>
      <h2>RH Dashboard</h2>
      {candidatures.length === 0 ? (
        <p>Aucune candidature pour l’instant.</p>
      ) : (
        <table border="1" cellPadding="5">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Email</th>
              <th>Score Total</th>
              <th>Skills</th>
              <th>Expérience</th>
              <th>Formation</th>
              <th>Projets</th>
            </tr>
          </thead>
          <tbody>
            {candidatures.map((cand) => (
              <tr key={cand.id}>
                <td>{cand.lastname}</td>
                <td>{cand.firstname}</td>
                <td>{cand.email}</td>
                <td>{cand.score}</td>
                <td>{cand.breakdown.skills}</td>
                <td>{cand.breakdown.experience}</td>
                <td>{cand.breakdown.formation}</td>
                <td>{cand.breakdown.projects}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RHDashboard;
