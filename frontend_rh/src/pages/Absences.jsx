import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Absences.css";

export default function TempsAbsences({ navigateToDashboard }) {
  const API_BASE = "http://127.0.0.1:8000/api";

  const [tab, setTab] = useState("absences");
  const [employees, setEmployees] = useState([]);

  // -----------------------------
  // Absences
  const [absences, setAbsences] = useState([]);
  const [absenceForm, setAbsenceForm] = useState({
    employee_id: "",
    date_debut: "",
    date_fin: "",
    type_absence: "maladie",
    statut: "en attente",
    motif: "",
  });
  const [editingAbsenceId, setEditingAbsenceId] = useState(null);
  const [showAbsenceForm, setShowAbsenceForm] = useState(false);

  // Pointages
  const [pointages, setPointages] = useState([]);
  const [pointageForm, setPointageForm] = useState({
    employee_id: "",
    date: "",
    heure_entree: "",
    heure_sortie: "",
  });
  const [editingPointageId, setEditingPointageId] = useState(null);
  const [showPointageForm, setShowPointageForm] = useState(false);

  // Congés
  const [conges, setConges] = useState([]);
  const [congeForm, setCongeForm] = useState({
    employee_id: "",
    date_debut: "",
    date_fin: "",
    type_conge: "annuel",
    statut: "en attente",
    motif: "",
  });
  const [editingCongeId, setEditingCongeId] = useState(null);
  const [showCongeForm, setShowCongeForm] = useState(false);

  // Soldes
  const [soldes, setSoldes] = useState([]);

  // Export
  const [exportData, setExportData] = useState([]);

  // -----------------------------
  // Fetch Employees
  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${API_BASE}/employes/`);
      setEmployees(res.data);
    } catch (err) {
      console.error("Erreur récupération employés :", err);
    }
  };

  // Fetch data selon tab
  const fetchData = async () => {
    fetchEmployees();

    try {
      if (tab === "absences") {
        const res = await axios.get(`${API_BASE}/absences/`);
        setAbsences(res.data);
      } else if (tab === "pointages") {
        const res = await axios.get(`${API_BASE}/pointages/`);
        setPointages(res.data);
      } else if (tab === "conges") {
        const res = await axios.get(`${API_BASE}/conges/`);
        setConges(res.data);
      } else if (tab === "soldes") {
        const res = await axios.get(`${API_BASE}/soldes/`);
        setSoldes(res.data);
      } else if (tab === "export") {
        const res = await axios.get(`${API_BASE}/export_paie/`);
        setExportData(res.data);
      }
    } catch (err) {
      console.error("Erreur récupération données :", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [tab]);

  const handleTabChange = (newTab) => {
    setTab(newTab);
  };

  // -----------------------------
  // Absences Handlers
  const handleAbsenceChange = (e) => setAbsenceForm({ ...absenceForm, [e.target.name]: e.target.value });
  const handleAbsenceSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAbsenceId) await axios.put(`${API_BASE}/absences/${editingAbsenceId}`, absenceForm);
      else await axios.post(`${API_BASE}/absences/`, absenceForm);

      setAbsenceForm({ employee_id: "", date_debut: "", date_fin: "", type_absence: "maladie", statut: "en attente", motif: "" });
      setEditingAbsenceId(null);
      setShowAbsenceForm(false);
      fetchData();
    } catch (err) { console.error("Erreur sauvegarde :", err); }
  };
  const handleAbsenceEdit = (a) => {
    setAbsenceForm({ employee_id: a.employee_id, date_debut: a.date_debut, date_fin: a.date_fin, type_absence: a.type_absence, statut: a.statut, motif: a.motif || "" });
    setEditingAbsenceId(a.id);
    setShowAbsenceForm(true);
  };
  const handleAbsenceDelete = async (id) => {
    if (!window.confirm("Confirmer la suppression ?")) return;
    await axios.delete(`${API_BASE}/absences/${id}`);
    fetchData();
  };

  // -----------------------------
  // Pointages Handlers
  const handlePointageChange = (e) => setPointageForm({ ...pointageForm, [e.target.name]: e.target.value });
  const handlePointageSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPointageId) await axios.put(`${API_BASE}/pointages/${editingPointageId}`, pointageForm);
      else await axios.post(`${API_BASE}/pointages/`, pointageForm);

      setPointageForm({ employee_id: "", date: "", heure_entree: "", heure_sortie: "" });
      setEditingPointageId(null);
      setShowPointageForm(false);
      fetchData();
    } catch (err) { console.error("Erreur pointage :", err); }
  };
  const handlePointageEdit = (p) => { setPointageForm({ employee_id: p.employee_id, date: p.date, heure_entree: p.heure_entree, heure_sortie: p.heure_sortie }); setEditingPointageId(p.id); setShowPointageForm(true); };
  const handlePointageDelete = async (id) => { if (!window.confirm("Confirmer la suppression ?")) return; await axios.delete(`${API_BASE}/pointages/${id}`); fetchData(); };

  // -----------------------------
  // Congés Handlers
  const handleCongeChange = (e) => setCongeForm({ ...congeForm, [e.target.name]: e.target.value });
  const handleCongeSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCongeId) await axios.put(`${API_BASE}/conges/${editingCongeId}`, congeForm);
      else await axios.post(`${API_BASE}/conges/`, congeForm);

      setCongeForm({ employee_id: "", date_debut: "", date_fin: "", type_conge: "annuel", statut: "en attente", motif: "" });
      setEditingCongeId(null);
      setShowCongeForm(false);
      fetchData();
    } catch (err) { console.error("Erreur congé :", err); }
  };
  const handleCongeEdit = (c) => { setCongeForm({ employee_id: c.employee_id, date_debut: c.date_debut, date_fin: c.date_fin, type_conge: c.type_conge, statut: c.statut, motif: c.motif || "" }); setEditingCongeId(c.id); setShowCongeForm(true); };
  const handleCongeDelete = async (id) => { if (!window.confirm("Confirmer la suppression ?")) return; await axios.delete(`${API_BASE}/conges/${id}`); fetchData(); };

  // -----------------------------
  // Export CSV / Excel
  const handleExport = (format) => {
    if (!exportData.length) return alert("Aucune donnée à exporter");
    const rows = exportData.map(e => {
      const emp = employees.find(emp => emp.id === e.employee_id);
      return { Employe: emp ? `${emp.nom} ${emp.prenom}` : "—", Mois: e.mois, Salaire: e.salaire };
    });

    if (format === "csv") {
      let csvContent = "data:text/csv;charset=utf-8," + ["Employe,Mois,Salaire", ...rows.map(r => `${r.Employe},${r.Mois},${r.Salaire}`)].join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "export_paie.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (format === "excel") {
      // Simple Excel export using HTML table format
      let table = "<table><tr><th>Employé</th><th>Mois</th><th>Salaire</th></tr>";
      rows.forEach(r => { table += `<tr><td>${r.Employe}</td><td>${r.Mois}</td><td>${r.Salaire}</td></tr>`; });
      table += "</table>";
      const uri = "data:application/vnd.ms-excel," + encodeURIComponent(table);
      const link = document.createElement("a");
      link.href = uri;
      link.download = "export_paie.xls";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // -----------------------------
  // UI
  return (
    <div className="temps-absences-page">
      <div className="header">
        <h2>Module Temps & Absences</h2>
        <div className="tabs">
          <button onClick={() => handleTabChange("absences")}>Absences</button>
          <button onClick={() => handleTabChange("pointages")}>Pointages</button>
          <button onClick={() => handleTabChange("conges")}>Congés</button>
          <button onClick={() => handleTabChange("soldes")}>Soldes</button>
          <button onClick={() => handleTabChange("export")}>Export Paie</button>
        </div>
      </div>

      {tab === "absences" && (
        <div className="tab-content">
          <button onClick={() => setShowAbsenceForm(!showAbsenceForm)}>{showAbsenceForm ? "Masquer Formulaire" : "Créer une absence"}</button>
          {showAbsenceForm && (
            <form onSubmit={handleAbsenceSubmit}>
              <label>Employé<input type="text" list="employees-list" name="employee_id" value={absenceForm.employee_id} onChange={handleAbsenceChange} />
                <datalist id="employees-list">{employees.map(emp => <option key={emp.id} value={emp.id}>{emp.nom} {emp.prenom}</option>)}</datalist>
              </label>
              <label>Date début <input type="date" name="date_debut" value={absenceForm.date_debut} onChange={handleAbsenceChange} /></label>
              <label>Date fin <input type="date" name="date_fin" value={absenceForm.date_fin} onChange={handleAbsenceChange} /></label>
              <label>Type<select name="type_absence" value={absenceForm.type_absence} onChange={handleAbsenceChange}>
                <option value="maladie">Maladie</option>
                <option value="conge">Congé</option>
                <option value="non_justifiee">Non justifiée</option>
              </select></label>
              <label>Statut<select name="statut" value={absenceForm.statut} onChange={handleAbsenceChange}>
                <option value="en attente">En attente</option>
                <option value="validée">Validée</option>
                <option value="refusée">Refusée</option>
              </select></label>
              <label>Motif <input type="text" name="motif" value={absenceForm.motif} onChange={handleAbsenceChange} /></label>
              <button type="submit">{editingAbsenceId ? "Modifier" : "Ajouter"}</button>
            </form>
          )}
          <table>
            <thead><tr><th>Employé</th><th>Début</th><th>Fin</th><th>Type</th><th>Statut</th><th>Motif</th><th>Actions</th></tr></thead>
            <tbody>{absences.map(a => {
              const emp = employees.find(e => e.id === a.employee_id);
              return <tr key={a.id}><td>{emp ? `${emp.nom} ${emp.prenom}` : "—"}</td><td>{a.date_debut}</td><td>{a.date_fin}</td><td>{a.type_absence}</td><td>{a.statut}</td><td>{a.motif || "—"}</td>
                <td><button onClick={() => handleAbsenceEdit(a)}>✏️</button><button onClick={() => handleAbsenceDelete(a.id)}>🗑️</button></td>
              </tr>;
            })}</tbody>
          </table>
        </div>
      )}

      {tab === "pointages" && (
        <div className="tab-content">
          <button onClick={() => setShowPointageForm(!showPointageForm)}>{showPointageForm ? "Masquer Formulaire" : "Créer un pointage"}</button>
          {showPointageForm && (
            <form onSubmit={handlePointageSubmit}>
              <label>Employé<input type="text" list="employees-list" value={pointageForm.employee_id} name="employee_id" onChange={handlePointageChange} />
                <datalist id="employees-list">{employees.map(emp => <option key={emp.id} value={emp.id}>{emp.nom} {emp.prenom}</option>)}</datalist>
              </label>
              <label>Date <input type="date" name="date" value={pointageForm.date} onChange={handlePointageChange} /></label>
              <label>Heure entrée <input type="time" name="heure_entree" value={pointageForm.heure_entree} onChange={handlePointageChange} /></label>
              <label>Heure sortie <input type="time" name="heure_sortie" value={pointageForm.heure_sortie} onChange={handlePointageChange} /></label>
              <button type="submit">{editingPointageId ? "Modifier" : "Ajouter"}</button>
            </form>
          )}
          <table>
            <thead><tr><th>Employé</th><th>Date</th><th>Heure Entrée</th><th>Heure Sortie</th><th>Actions</th></tr></thead>
            <tbody>{pointages.map(p => {
              const emp = employees.find(e => e.id === p.employee_id);
              return <tr key={p.id}><td>{emp ? `${emp.nom} ${emp.prenom}` : "—"}</td><td>{p.date}</td><td>{p.heure_entree}</td><td>{p.heure_sortie}</td>
                <td><button onClick={() => handlePointageEdit(p)}>✏️</button><button onClick={() => handlePointageDelete(p.id)}>🗑️</button></td>
              </tr>;
            })}</tbody>
          </table>
        </div>
      )}

      {tab === "conges" && (
        <div className="tab-content">
          <button onClick={() => setShowCongeForm(!showCongeForm)}>{showCongeForm ? "Masquer Formulaire" : "Créer un congé"}</button>
          {showCongeForm && (
            <form onSubmit={handleCongeSubmit}>
              <label>Employé<input type="text" list="employees-list" value={congeForm.employee_id} name="employee_id" onChange={handleCongeChange} />
                <datalist id="employees-list">{employees.map(emp => <option key={emp.id} value={emp.id}>{emp.nom} {emp.prenom}</option>)}</datalist>
              </label>
              <label>Date début <input type="date" name="date_debut" value={congeForm.date_debut} onChange={handleCongeChange} /></label>
              <label>Date fin <input type="date" name="date_fin" value={congeForm.date_fin} onChange={handleCongeChange} /></label>
              <label>Type<select name="type_conge" value={congeForm.type_conge} onChange={handleCongeChange}>
                <option value="annuel">Annuel</option>
                <option value="maladie">Maladie</option>
                <option value="exceptionnel">Exceptionnel</option>
              </select></label>
              <label>Statut<select name="statut" value={congeForm.statut} onChange={handleCongeChange}>
                <option value="en attente">En attente</option>
                <option value="validée">Validée</option>
                <option value="refusée">Refusée</option>
              </select></label>
              <label>Motif <input type="text" name="motif" value={congeForm.motif} onChange={handleCongeChange} /></label>
              <button type="submit">{editingCongeId ? "Modifier" : "Ajouter"}</button>
            </form>
          )}
          <table>
            <thead><tr><th>Employé</th><th>Début</th><th>Fin</th><th>Type</th><th>Statut</th><th>Motif</th><th>Actions</th></tr></thead>
            <tbody>{conges.map(c => {
              const emp = employees.find(e => e.id === c.employee_id);
              return <tr key={c.id}><td>{emp ? `${emp.nom} ${emp.prenom}` : "—"}</td><td>{c.date_debut}</td><td>{c.date_fin}</td><td>{c.type_conge}</td><td>{c.statut}</td><td>{c.motif || "—"}</td>
                <td><button onClick={() => handleCongeEdit(c)}>✏️</button><button onClick={() => handleCongeDelete(c.id)}>🗑️</button></td>
              </tr>;
            })}</tbody>
          </table>
        </div>
      )}

      {tab === "soldes" && (
        <div className="tab-content">
          <h3>Soldes des employés</h3>
          <table>
            <thead><tr><th>Employé</th><th>Solde Congés</th></tr></thead>
            <tbody>{soldes.map(s => {
              const emp = employees.find(e => e.id === s.employee_id);
              return <tr key={s.employee_id}><td>{emp ? `${emp.nom} ${emp.prenom}` : "—"}</td><td>{s.solde_conges}</td></tr>;
            })}</tbody>
          </table>
        </div>
      )}

      {tab === "export" && (
        <div className="tab-content">
          <h3>Export Paie</h3>
          <button onClick={() => {
            const choice = window.prompt("Tapez 'csv' pour CSV ou 'excel' pour Excel");
            if (choice === "csv") handleExport("csv");
            else if (choice === "excel") handleExport("excel");
          }}>Télécharger Export</button>

          <table>
            <thead><tr><th>Employé</th><th>Mois</th><th>Salaire</th></tr></thead>
            <tbody>{exportData.map(e => {
              const emp = employees.find(emp => emp.id === e.employee_id);
              return <tr key={e.id}><td>{emp ? `${emp.nom} ${emp.prenom}` : "—"}</td><td>{e.mois}</td><td>{e.salaire}</td></tr>;
            })}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}
