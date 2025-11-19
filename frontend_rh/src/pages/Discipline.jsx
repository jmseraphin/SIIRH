// src/pages/Discipline.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Discipline.css"; // Ataovy azo antoka fa misy ilay fichier

export default function Discipline() {
  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCase, setNewCase] = useState({
    employee_id: "",
    fault_type: "",
    description: "",
  });
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState("");

  // --- Fetch all cases ---
  const fetchCases = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/discipline/cases");
      setCases(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  // --- Handle form creation ---
  const handleNewCaseChange = (e) => {
    setNewCase({ ...newCase, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleCreateCase = async (e) => {
    e.preventDefault();
    setMessage("⏳ Création du dossier en cours...");
    try {
      const formData = new FormData();
      formData.append("employee_id", newCase.employee_id);
      formData.append("fault_type", newCase.fault_type);
      formData.append("description", newCase.description);
      files.forEach((file) => formData.append("files", file));

      const res = await axios.post(
        "http://127.0.0.1:8000/discipline/cases",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setMessage("✅ Dossier disciplinaire créé !");
      setShowCreateForm(false);
      setNewCase({ employee_id: "", fault_type: "", description: "" });
      setFiles([]);
      fetchCases();
    } catch (err) {
      console.error(err);
      setMessage("❌ Erreur lors de la création du dossier.");
    }
  };

  // --- View case details ---
  const handleView = async (caseItem) => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/discipline/cases/${caseItem.id}`);
      setSelectedCase(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // --- Convocation ---
  const handleConvocation = async (caseItem) => {
    try {
      const res = await axios.post(`http://127.0.0.1:8000/discipline/cases/${caseItem.id}/convocation`);
      window.open(res.data.pdf_url, "_blank");
    } catch (err) {
      console.error(err);
    }
  };

  // --- Decision ---
  const handleDecision = async (caseItem) => {
    const decisionType = prompt("Type de décision (Avertissement / Mise à pied / Licenciement) :");
    const notes = prompt("Notes / Commentaire :");
    if (!decisionType) return;
    try {
      const res = await axios.post(
        `http://127.0.0.1:8000/discipline/cases/${caseItem.id}/decision`,
        { decision_type: decisionType, decision_notes: notes }
      );
      alert("Décision PDF généré !");
      window.open(res.data.pdf_url, "_blank");
      fetchCases();
    } catch (err) {
      console.error(err);
    }
  };

  // --- Lettre de licenciement ---
  const handleGenerateLetter = async (caseItem) => {
    try {
      const res = await axios.post(
        `http://127.0.0.1:8000/discipline/cases/${caseItem.id}/generate-letter`
      );
      window.open(res.data.pdf_url, "_blank");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="discipline-page">
      <h1>Gestion Disciplinaire</h1>

      <button onClick={() => setShowCreateForm(!showCreateForm)}>
        {showCreateForm ? "Annuler création" : "Créer un dossier disciplinaire"}
      </button>

      {message && <p className="status-message">{message}</p>}

      {showCreateForm && (
        <form onSubmit={handleCreateCase} className="create-discipline-form">
          <label>Employé ID :</label>
          <input type="text" name="employee_id" value={newCase.employee_id} onChange={handleNewCaseChange} required />

          <label>Type de faute :</label>
          <select name="fault_type" value={newCase.fault_type} onChange={handleNewCaseChange} required>
            <option value="">Sélectionner type</option>
            <option value="Avertissement">Avertissement</option>
            <option value="Mise à pied">Mise à pied</option>
            <option value="Licenciement">Licenciement</option>
          </select>

          <label>Description :</label>
          <textarea name="description" value={newCase.description} onChange={handleNewCaseChange} required />

          <label>Joindre fichiers / preuves :</label>
          <input type="file" multiple onChange={handleFileChange} />

          <button type="submit">💾 Créer le dossier</button>
        </form>
      )}

      <h2>Cas en cours</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Employé</th>
            <th>Type de faute</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cases.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.employee_id}</td>
              <td>{c.fault_type}</td>
              <td>{c.status}</td>
              <td>
                <button onClick={() => handleView(c)}>Voir</button>
                <button onClick={() => handleConvocation(c)}>Convocation</button>
                <button onClick={() => handleDecision(c)}>Décision</button>
                {c.fault_type === "Licenciement" && (
                  <button onClick={() => handleGenerateLetter(c)}>Lettre Licenciement</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedCase && (
        <div className="modal">
          <div>
            <h2>Détails du cas #{selectedCase.id}</h2>
            <p>Employé ID: {selectedCase.employee_id}</p>
            <p>Type de faute: {selectedCase.fault_type}</p>
            <p>Description: {selectedCase.description}</p>
            <p>Status: {selectedCase.status}</p>

            <h3>Preuves:</h3>
            <ul>
              {selectedCase.evidences?.map((e, i) => (
                <li key={i}>
                  <a href={e.file_url} target="_blank" rel="noreferrer">{e.file_name}</a>
                </li>
              ))}
            </ul>

            <h3>Historique des events:</h3>
            <ul>
              {selectedCase.events?.map((ev, i) => (
                <li key={i}>{ev.event_type} : {JSON.stringify(ev.event_data)}</li>
              ))}
            </ul>

            <button onClick={() => setSelectedCase(null)}>Fermer</button>
          </div>
        </div>
      )}
    </div>
  );
}
