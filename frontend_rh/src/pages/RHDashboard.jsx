import React, { useEffect, useState } from "react";
import { Users, CheckCircle, Clock, Home, FileText, ClipboardList, Trash2, Copy } from "lucide-react";
import "./RHDashboard.css";

const RHDashboard = () => {
  const [candidatures, setCandidatures] = useState([]);
  const [entretiens, setEntretiens] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [view, setView] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [posteSearch, setPosteSearch] = useState("");
  const [rangeInput, setRangeInput] = useState("");
  const [employees, setEmployees] = useState([]);
  const [employeeStatus, setEmployeeStatus] = useState({});
  const [selectedConvoques, setSelectedConvoques] = useState([]); // NEW: checkbox selection

  // ------------------ FETCH ------------------
  const fetchCandidatures = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/rh/candidatures");
      if (!res.ok) throw new Error("Erreur de chargement");
      const data = await res.json();
      const sorted = data.sort((a, b) => (b.score_total || 0) - (a.score_total || 0));
      setCandidatures(sorted);
      setFiltered(sorted);
      setLoading(false);
    } catch (err) {
      console.error("Erreur:", err);
      setLoading(false);
    }
  };

  const fetchEntretiens = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/entretiens");
      if (!res.ok) throw new Error("Erreur chargement entretiens");
      const data = await res.json();
      setEntretiens(data);
    } catch (err) {
      console.error("Erreur fetch entretiens:", err);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/employes/");
      if (!res.ok) throw new Error("Erreur chargement employés");
      const data = await res.json();
      setEmployees(data);

      const statusMap = {};
      data.forEach(emp => {
        if (emp.candidature_id) statusMap[emp.candidature_id] = true;
      });
      setEmployeeStatus(statusMap);
    } catch (err) {
      console.error("Erreur fetch employés:", err);
    }
  };

  useEffect(() => {
    fetchCandidatures();
    fetchEntretiens();
    fetchEmployees();
  }, []);

  // ------------------ UTILITAIRES ------------------
  const updateStatutLocal = (id, newStatut, dateConvocation = null, heureConvocation = null) => {
    setCandidatures(prev =>
      prev.map(c =>
        c.id === id
          ? { ...c, statut: newStatut, date_convocation: dateConvocation || c.date_convocation, heure_convocation: heureConvocation || c.heure_convocation }
          : c
      )
    );
    setFiltered(prev =>
      prev
        .map(c =>
          c.id === id
            ? { ...c, statut: newStatut, date_convocation: dateConvocation || c.date_convocation, heure_convocation: heureConvocation || c.heure_convocation }
            : c
        )
        .sort((a, b) => (b.score_total || 0) - (a.score_total || 0))
    );
  };

  const handleSelect = async (id) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/rh/candidatures/${id}/select`, { method: "PUT", headers: { "Content-Type": "application/json" } });
      if (res.ok) updateStatutLocal(id, "Sélectionné");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeselect = async (id) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/rh/candidatures/${id}/deselect`, { method: "PUT", headers: { "Content-Type": "application/json" } });
      if (res.ok) updateStatutLocal(id, "Désélectionné");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeselectRange = async () => {
    let [start, end] = rangeInput.split("-").map(n => parseInt(n.trim(), 10));
    if (!end) end = start;
    if (!start || !end || start > end) return alert("Format invalide (ex: 1-100 ou 7)");
    const selectionnes = filtered.filter(c => c.statut === "Sélectionné");
    const toDeselect = selectionnes.slice(start - 1, end);
    for (const c of toDeselect) await handleDeselect(c.id);
    alert(`Les candidats du rang ${start} à ${end} ont été désélectionnés.`);
  };

  const handleSendConvocation = async (id) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/rh/candidatures/${id}/send-invitation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        const data = await res.json();
        updateStatutLocal(id, "Convoqué", data.date_entretien, data.heure_entretien);
        fetchCandidatures();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddEmployee = async (id) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/employes/from-candidature/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        updateStatutLocal(id, "Employé");
        setEmployeeStatus(prev => ({ ...prev, [id]: true }));
        fetchEmployees();
      } else alert("Erreur lors de l'ajout comme Employee.");
    } catch (err) {
      console.error(err);
      alert("Erreur réseau lors de l'ajout comme Employee.");
    }
  };

  const handleDeleteCandidature = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce candidat ?")) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/rh/candidatures/${id}`, { method: "DELETE" });
      if (res.ok) {
        setCandidatures(prev => prev.filter(c => c.id !== id));
        setFiltered(prev => prev.filter(c => c.id !== id));
        setSelectedConvoques(prev => prev.filter(cid => cid !== id));
      } else {
        alert("Erreur lors de la suppression du candidat.");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur réseau lors de la suppression.");
    }
  };

  const handleCopyCandidature = (c) => {
    const info = `Nom: ${c.nom} ${c.prenom}\nPoste: ${c.poste}\nEmail: ${c.email || "—"}\nTél: ${c.phone || "—"}`;
    navigator.clipboard.writeText(info).then(() => alert("Informations copiées dans le presse-papiers"));
  };

  const handleCheckboxChange = (id) => {
    setSelectedConvoques(prev =>
      prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id]
    );
  };

  const handleFilter = (type) => {
    setView(type);
    if (type === "total") setFiltered(candidatures);
    else if (type === "selectionnee") setFiltered(candidatures.filter(c => c.statut === "Sélectionné"));
    else if (type === "attente") setFiltered(candidatures.filter(c => c.statut === "En attente"));
    else if (type === "convoque") {
      setFiltered(candidatures.filter(c => c.statut === "Convoqué"));
      setSelectedConvoques([]);
    } else if (type === "fait_entretien") {
      const merged = candidatures
        .map(c => {
          const e = entretiens.find(en => parseInt(en.cand_id) === c.id);
          if (e) {
            const totalScore = Math.round((e.tech_score + e.soft_score + e.cult_score + e.lang_score + e.disp_score + e.sal_score) / 6);
            return { ...c, decision: e.decision, score_total: totalScore, raw_scores: `${e.tech_score}/${5} ${e.soft_score}/${5} ${e.cult_score}/${5} ${e.lang_score}/${5} ${e.disp_score}/${5} ${e.sal_score}/${5}`, statut: "Entretien terminé" };
          }
          return null;
        })
        .filter(Boolean);
      merged.sort((a, b) => (b.score_total || 0) - (a.score_total || 0));
      setFiltered(merged);
    } else if (type === "employees") {
      setFiltered(employees);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    if (!term.trim()) handleFilter(view);
    else setFiltered(prev => prev.filter(c => c.nom?.toLowerCase().includes(term) || c.prenom?.toLowerCase().includes(term) || c.poste?.toLowerCase().includes(term)));
  };

  const handlePosteSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setPosteSearch(term);
    if (!term.trim()) handleFilter(view);
    else setFiltered(prev => prev.filter(c => c.nom?.toLowerCase().includes(term) || c.prenom?.toLowerCase().includes(term) || c.poste?.toLowerCase().includes(term)));
  };

  const handleAutoSelectRange = async () => {
    let [start, end] = rangeInput.split("-").map(n => parseInt(n.trim(), 10));
    if (!end) end = start;
    if (!start || !end || start > end) return alert("Format invalide (ex: 1-100 ou 7)");
    const enAttente = filtered.filter(c => c.statut === "En attente" || c.statut === "Désélectionné");
    const toSelect = enAttente.slice(start - 1, end);
    for (const c of toSelect) await handleSelect(c.id);
    alert(`Les candidats du rang ${start} à ${end} ont été sélectionnés.`);
  };

  const titreTableau = {
    total: "Toutes les candidatures",
    selectionnee: "Candidats sélectionnés",
    attente: "Candidats en attente",
    convoque: "Candidats convoqués",
    fait_entretien: "Candidats ayant terminé l’entretien",
    employees: "Liste des Employés",
  };

  const countEntretienTermine = candidatures.filter(c => entretiens.find(en => parseInt(en.cand_id) === c.id)).length;

  // ------------------ RENDER ------------------
  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-header">
        <h1 className="dashboard-title">
          <Home className="dashboard-title-icon" />
          Tableau de bord RH
        </h1>
        <div className="dashboard-search">
          <input type="text" value={searchTerm} onChange={handleSearch} placeholder="Rechercher un candidat ou un poste..." />
        </div>
      </div>

      {view === "overview" && (
        <div style={{ display: "flex", gap: "18px", flexWrap: "wrap", marginTop: "25px" }}>
          {[
            { id: "total", icon: <Users size={22} color="#fff" />, label: "Candidatures totales", value: candidatures.length, color: "#1E90FF" },
            { id: "selectionnee", icon: <CheckCircle size={22} color="#fff" />, label: "Sélectionnées", value: candidatures.filter(c => c.statut === "Sélectionné").length, color: "#28a745" },
            { id: "convoque", icon: <Clock size={22} color="#fff" />, label: "Convoqués", value: candidatures.filter(c => c.statut === "Convoqué").length, color: "#dc3545" },
            { id: "attente", icon: <Clock size={22} color="#fff" />, label: "En attente", value: candidatures.filter(c => c.statut === "En attente").length, color: "#d3ab31ff" },
            { id: "fait_entretien", icon: <ClipboardList size={22} color="#fff" />, label: "Liste des Entretiens", value: countEntretienTermine, color: "#6f42c1" },
            { id: "employees", icon: <Users size={22} color="#fff" />, label: "Employés", value: employees.length, color: "#dd8c13ff" },
          ].map(item => (
            <div
              key={item.id}
              onClick={() => handleFilter(item.id)}
              style={{
                width: "250px",
                height: "82px",
                backgroundColor: item.color,
                borderRadius: "14px",
                padding: "14px 20px",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                boxSizing: "border-box",
                transition: "0.2s",
              }}
              onMouseOver={e => e.currentTarget.style.transform = "scale(1.03)"}
              onMouseOut={e => e.currentTarget.style.transform = "scale(1)"}
            >
              <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <div style={{ marginBottom: "2px" }}>{item.icon}</div>
                  <span style={{ fontSize: "14px", fontWeight: "600", marginTop: "-1px" }}>{item.label}</span>
                </div>
                <div style={{ fontSize: "27px", fontWeight: "700", marginRight: "4px" }}>{item.value}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {view !== "overview" && (
        <div className="mt-10">
          <button onClick={() => setView("overview")} className="back-btn mb-5">⬅️ Retour à la Vue d’ensemble</button>
          <h2 className="text-xl font-bold text-green-700 mb-4">{titreTableau[view]}</h2>

          {(view === "selectionnee" || view === "fait_entretien" || view === "employees") && (
            <div style={{ marginBottom: "10px" }}>
              <input type="text" value={posteSearch} onChange={handlePosteSearch} placeholder="Filtrer par poste" style={{ padding: "5px 8px", borderRadius: "6px", border: "1px solid #ccc", width: "180px", fontSize: "13px" }} />
            </div>
          )}

          {!loading && (
            <div className="liste-entretien-container">
              <table className="entretien-table">
                <thead>
                  <tr>
                    {view === "convoque" && <th style={{ width: "30px" }}></th>}
                    <th>ID</th>
                    <th>Rang</th>
                    <th>Nom</th>
                    <th>Prénom</th>
                    <th>Poste</th>
                    {view === "employees" && <><th>Email</th><th>Tél</th></>}
                    {view !== "employees" && <><th>{view === "convoque" ? "DATE ET HEURE" : "DATE"}</th><th>Score</th><th>Décision</th></>}
                    {(view === "total" || view === "selectionnee") && <th>Action</th>}
                    {view === "fait_entretien" && <th>Action</th>}
                  </tr>
                </thead>
                <tbody>
                  {(view === "employees" ? employees : filtered).map((c, index) => (
                    <tr key={c.id}>
                      {view === "convoque" && (
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedConvoques.includes(c.id)}
                            onChange={() => handleCheckboxChange(c.id)}
                            style={{ width: "14px", height: "14px", borderRadius: "50%", cursor: "pointer" }}
                          />
                        </td>
                      )}
                      <td>{c.id}</td>
                      <td>{candidatures.findIndex(x => x.id === c.id) + 1}</td>
                      <td>{c.nom}</td>
                      <td>{c.prenom}</td>
                      <td>{c.poste}</td>
                      {view === "employees" && <><td>{c.email || "—"}</td><td>{c.phone || "—"}</td></>}
                      {view !== "employees" && (
                        <td>
                          {view === "convoque"
                            ? `${c.date_entretien || "Acune"} ${c.heure_entretien || ""}`
                            : `${c.date_candidature ? new Date(c.date_candidature).toLocaleDateString() : "—"}`} 
                        </td>
                      )}
                      {view !== "employees" && <td>{view === "fait_entretien" ? `${c.score_total}/5` : c.score_total || "—"}</td>}
                      {view !== "employees" && <td className={`decision ${c.statut === "Sélectionné" ? "go" : c.statut === "Convoqué" ? "blue" : c.statut === "Désélectionné" ? "danger" : "hold"}`}>{c.decision || c.statut}</td>}

                      {view === "convoque" && selectedConvoques.includes(c.id) && (
                        <td style={{ display: "flex", gap: "6px" }}>
                          <button onClick={() => handleDeleteCandidature(c.id)} className="mini-btn danger">
                            <Trash2 size={14} />
                          </button>
                          <button onClick={() => handleCopyCandidature(c)} className="mini-btn blue">
                            <Copy size={14} />
                          </button>
                        </td>
                      )}

                      {(view === "total" || view === "selectionnee") && (
                        <td>
                          {view === "selectionnee" ? (
                            <button onClick={() => handleSendConvocation(c.id)} className="mini-btn blue">Envoyer convocation</button>
                          ) : (
                            <div>
                              {index === 0 ? (<input type="text" placeholder="Filtrer par poste" value={posteSearch} onChange={handlePosteSearch} className="mini-input" />) :
                                index === 1 ? (<input type="text" placeholder="1-100" value={rangeInput} onChange={(e) => setRangeInput(e.target.value)} className="mini-input" />) :
                                  index === 2 ? (<button onClick={handleAutoSelectRange} className="mini-btn success">Sélectionner par rang</button>) :
                                    index === 3 ? (<button onClick={async () => await handleDeselectRange()} className="mini-btn danger" style={{ width: "160px" }}>Désélectionner</button>) : "-"}
                            </div>
                          )}
                        </td>
                      )}

                      {view === "fait_entretien" && (
                        <td>
                          <button
                            onClick={() => handleAddEmployee(c.id)}
                            className="mini-btn employee"
                            style={{
                              backgroundColor: employeeStatus[c.id] ? "#28a745" : "#1E90FF",
                              color: "#fff",
                              cursor: employeeStatus[c.id] ? "not-allowed" : "pointer"
                            }}
                            disabled={employeeStatus[c.id]}
                          >
                            {employeeStatus[c.id] ? "Déjà employé" : "Employee"}
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RHDashboard;
















