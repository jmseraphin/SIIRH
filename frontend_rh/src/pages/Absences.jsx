import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Absences.css";

export default function Absences({ navigateToDashboard }) {
  const [absences, setAbsences] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    employee_id: "",
    date_debut: "",
    date_fin: "",
    type_absence: "maladie",
    statut: "en attente",
    motif: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const API_BASE = "http://127.0.0.1:8000/api";

  // 🔹 Récupérer les employés et les absences
  const fetchData = async () => {
    try {
      const empRes = await axios.get(`${API_BASE}/employes/`);
      setEmployees(empRes.data);

      const absRes = await axios.get(`${API_BASE}/absences/`);
      setAbsences(absRes.data);
    } catch (error) {
      console.error("Erreur récupération données :", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🔹 Gestion du formulaire
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 Ajouter ou modifier une absence
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_BASE}/absences/${editingId}`, form);
      } else {
        await axios.post(`${API_BASE}/absences/`, form);
      }
      setForm({
        employee_id: "",
        date_debut: "",
        date_fin: "",
        type_absence: "maladie",
        statut: "en attente",
        motif: "",
      });
      setEditingId(null);
      setShowForm(false);
      fetchData();
    } catch (error) {
      console.error("Erreur sauvegarde :", error);
    }
  };

  // 🔹 Supprimer une absence
  const handleDelete = async (id) => {
    if (!window.confirm("Confirmer la suppression ?")) return;
    try {
      await axios.delete(`${API_BASE}/absences/${id}`);
      fetchData();
    } catch (error) {
      console.error("Erreur suppression :", error);
    }
  };

  // 🔹 Éditer une absence
  const handleEdit = (absence) => {
    setForm({
      employee_id: absence.employee_id,
      date_debut: absence.date_debut,
      date_fin: absence.date_fin,
      type_absence: absence.type_absence,
      statut: absence.statut,
      motif: absence.motif || "",
    });
    setEditingId(absence.id);
    setShowForm(true);
  };

  return (
    <div className="absences-page">
      {/* === Header avec X et – === */}
      <div className="header-absences">
        <h2>Gestion des Absences</h2>
        <div className="window-controls">
          <button
            className="minimize"
            onClick={() => {
              document.querySelector(".absences-page").style.display = "none";
            }}
          >
            –
          </button>
          <button
            className="close"
            onClick={() => {
              if (navigateToDashboard) navigateToDashboard();
            }}
          >
            X
          </button>
        </div>
      </div>

      {/* === Bouton pour afficher le formulaire === */}
      <button className="toggle-form-btn" onClick={() => setShowForm(!showForm)}>
        {showForm ? "Masquer le formulaire" : "Créer une absence"}
      </button>

      {/* === Formulaire === */}
      {showForm && (
        <form onSubmit={handleSubmit} className="absence-form">
          <label>
            Employé
            <input
              type="text"
              placeholder="Rechercher un employé..."
              onChange={(e) => setForm({ ...form, employee_id: e.target.value })}
              list="employees-list"
              value={
                employees.find((emp) => emp.id === parseInt(form.employee_id))
                  ? employees.find((emp) => emp.id === parseInt(form.employee_id))
                      .nom +
                    " " +
                    employees.find((emp) => emp.id === parseInt(form.employee_id))
                      .prenom
                  : form.employee_id
              }
              required
            />
            <datalist id="employees-list">
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.nom} {emp.prenom}
                </option>
              ))}
            </datalist>
          </label>

          <label>
            Date début
            <input
              type="date"
              name="date_debut"
              value={form.date_debut}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Date fin
            <input
              type="date"
              name="date_fin"
              value={form.date_fin}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Type d'absence
            <select
              name="type_absence"
              value={form.type_absence}
              onChange={handleChange}
            >
              <option value="maladie">Maladie</option>
              <option value="conge">Congé</option>
              <option value="non_justifiee">Non justifiée</option>
            </select>
          </label>

          <label>
            Statut
            <select
              name="statut"
              value={form.statut}
              onChange={handleChange}
            >
              <option value="en attente">En attente</option>
              <option value="validée">Validée</option>
              <option value="refusée">Refusée</option>
            </select>
          </label>

          <label>
            Motif
            <input
              type="text"
              name="motif"
              placeholder="Renseigner le motif"
              value={form.motif}
              onChange={handleChange}
            />
          </label>

          <div className="form-buttons">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
                setForm({
                  employee_id: "",
                  date_debut: "",
                  date_fin: "",
                  type_absence: "maladie",
                  statut: "en attente",
                  motif: "",
                });
              }}
            >
              Annuler
            </button>
            <button type="submit">{editingId ? "Modifier" : "Ajouter"}</button>
          </div>
        </form>
      )}

      {/* === Tableau === */}
      <table className="absence-table">
        <thead>
          <tr>
            <th>Employé</th>
            <th>Date début</th>
            <th>Date fin</th>
            <th>Type</th>
            <th>Statut</th>
            <th>Motif</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {absences.map((a) => {
            const emp = employees.find((e) => e.id === a.employee_id);
            return (
              <tr key={a.id}>
                <td>{emp ? `${emp.nom} ${emp.prenom}` : "—"}</td>
                <td>{a.date_debut}</td>
                <td>{a.date_fin}</td>
                <td>{a.type_absence}</td>
                <td>{a.statut}</td>
                <td>{a.motif || "—"}</td>
                <td>
                  <button onClick={() => handleEdit(a)}>✏️</button>
                  <button onClick={() => handleDelete(a.id)}>🗑️</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
