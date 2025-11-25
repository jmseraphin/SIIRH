import React, { useEffect, useState } from "react";
import api from "../api";


export default function Pointages({ employees }) {
const [pointages, setPointages] = useState([]);
const [form, setForm] = useState({ employee_id: "", date: "", heure_entree: "", heure_sortie: "" });
const [editingId, setEditingId] = useState(null);
const [showForm, setShowForm] = useState(false);


const fetchPointages = async () => {
try { const res = await api.get(`/pointages/`); setPointages(res.data || []); } catch (err) { console.error(err); }
};


useEffect(() => { fetchPointages(); }, []);


const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
const handleSubmit = async (e) => {
e.preventDefault();
try {
if (editingId) await api.put(`/pointages/${editingId}`, form);
else await api.post(`/pointages/`, form);
setForm({ employee_id: "", date: "", heure_entree: "", heure_sortie: "" });
setEditingId(null);
setShowForm(false);
fetchPointages();
} catch (err) { console.error("Erreur pointage :", err); }
};


const handleEdit = (p) => { setForm({ employee_id: p.employee_id, date: p.date, heure_entree: p.heure_entree, heure_sortie: p.heure_sortie }); setEditingId(p.id); setShowForm(true); };
const handleDelete = async (id) => { if (!window.confirm("Confirmer la suppression ?")) return; await api.delete(`/pointages/${id}`); fetchPointages(); };


const getEmployeeLabel = (id) => { const emp = employees.find(e => e.id === id); return emp ? `${emp.nom} ${emp.prenom}` : "—"; };


return (
<div className="tab-content">
<button onClick={() => setShowForm(!showForm)}>{showForm ? "Masquer Formulaire" : "Créer un pointage"}</button>
{showForm && (
<form onSubmit={handleSubmit} className="mini-form">
<label>Employé<input type="text" list="employees-list" name="employee_id" value={form.employee_id} onChange={handleChange} required /></label>
<label>Date <input type="date" name="date" value={form.date} onChange={handleChange} required /></label>
<label>Heure entrée <input type="time" name="heure_entree" value={form.heure_entree} onChange={handleChange} /></label>
<label>Heure sortie <input type="time" name="heure_sortie" value={form.heure_sortie} onChange={handleChange} /></label>
<button type="submit">{editingId ? "Modifier" : "Ajouter"}</button>
</form>
)}


<table className="data-table">
<thead><tr><th>Employé</th><th>Date</th><th>Heure Entrée</th><th>Heure Sortie</th><th>Actions</th></tr></thead>
<tbody>
{pointages.map(p => (
<tr key={p.id}>
<td>{getEmployeeLabel(p.employee_id)}</td>
<td>{p.date}</td>
<td>{p.heure_entree}</td>
<td>{p.heure_sortie}</td>
<td>
<button onClick={() => handleEdit(p)}>✏️</button>
<button onClick={() => handleDelete(p.id)}>🗑️</button>
</td>
</tr>
))}
</tbody>
</table>
</div>
);
}