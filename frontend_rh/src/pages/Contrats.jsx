import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Contrats = () => {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    employee_id: "",
    type_contrat: "CDI",
    date_debut: "",
    date_fin: "",
    salaire: 0,
  });

  useEffect(() => {
    axios
      .get("/api/employes")
      .then((res) => setEmployees(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "salaire" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, employee_id: parseInt(formData.employee_id) };
      await axios.post("/api/contrats/", payload);

      toast.success("✅ Contrat créé avec succès !", {
        position: "bottom-right",
        autoClose: 3000,
      });

      setFormData({
        employee_id: "",
        type_contrat: "CDI",
        date_debut: "",
        date_fin: "",
        salaire: 0,
      });
    } catch (err) {
      console.error(err);
      toast.error("❌ Erreur lors de l'enregistrement du contrat !");
    }
  };

  return (
    <div>
      <h2>Créer un nouveau contrat</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Employé:
          <select
            name="employee_id"
            value={formData.employee_id}
            onChange={handleChange}
            required
          >
            <option value="">--Sélectionnez--</option>
            {employees.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nom} {e.prenom} ({e.poste || "Non défini"}) - {e.phone || "Aucune"}
              </option>
            ))}
          </select>
        </label>

        <label>
          Type de contrat:
          <select
            name="type_contrat"
            value={formData.type_contrat}
            onChange={handleChange}
          >
            <option value="CDI">CDI</option>
            <option value="CDD">CDD</option>
            <option value="Stage">Stage</option>
          </select>
        </label>

        <label>
          Date début:
          <input
            type="date"
            name="date_debut"
            value={formData.date_debut}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Date fin:
          <input
            type="date"
            name="date_fin"
            value={formData.date_fin}
            onChange={handleChange}
          />
        </label>

        <label>
          Salaire:
          <input
            type="number"
            step="0.01"
            name="salaire"
            value={formData.salaire}
            onChange={handleChange}
          />
        </label>

        <button type="submit">Enregistrer</button>
      </form>

      <ToastContainer />
    </div>
  );
};

export default Contrats;
