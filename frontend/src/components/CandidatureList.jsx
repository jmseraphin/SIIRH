import { useEffect, useState } from "react";
import axios from "axios";

export default function CandidatureList() {
  const [candidats, setCandidats] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/api/recrutement/candidatures")
      .then(res => setCandidats(res.data))
      .catch(err => console.error("Erreur fetch:", err));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Liste des Candidats</h2>
      <ul>
        {candidats.map(c => (
          <li key={c.id}>
            ID {c.id} - {c.fullname} - 
            <a href={`http://localhost:8000/${c.raw_cv_path}`} target="_blank" rel="noreferrer">
              Voir CV
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
