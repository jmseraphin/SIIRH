// import { useEffect, useState } from "react";
// import { getEmployees } from "../api/employeeApi";
// import { createPaie } from "../api/paieApi";

// export default function PaieForm({ onSaved }) {
//   const [employees, setEmployees] = useState([]);
//   const [form, setForm] = useState({
//     employee_id: "",
//     salaire_base: "",
//     primes: 0,
//     heures_supp: 0,
//     deductions: 0,
//     mois: "",
//     annee: ""
//   });

//   useEffect(() => {
//     getEmployees().then((res) => setEmployees(res.data));
//   }, []);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     await createPaie(form);
//     onSaved();
//   };

//   return (
//     <form className="paie-form" onSubmit={handleSubmit}>
//       <select
//         name="employee_id"
//         value={form.employee_id}
//         onChange={handleChange}
//         required
//       >
//         <option value="">Sélectionner un employé</option>
//         {employees.map((emp) => (
//           <option key={emp.id} value={emp.id}>
//             {emp.fullname || `${emp.nom} ${emp.prenom}`}
//           </option>
//         ))}
//       </select>

//       <input
//         type="number"
//         name="salaire_base"
//         placeholder="Salaire de base"
//         onChange={handleChange}
//         required
//       />

//       <input
//         type="number"
//         name="primes"
//         placeholder="Primes"
//         onChange={handleChange}
//       />

//       <input
//         type="number"
//         name="heures_supp"
//         placeholder="Heures supplémentaires"
//         onChange={handleChange}
//       />

//       <input
//         type="number"
//         name="deductions"
//         placeholder="Déductions"
//         onChange={handleChange}
//       />

//       <input
//         type="text"
//         name="mois"
//         placeholder="Mois (ex: Janvier)"
//         onChange={handleChange}
//         required
//       />

//       <input
//         type="number"
//         name="annee"
//         placeholder="Année (ex: 2025)"
//         onChange={handleChange}
//         required
//       />

//       <button type="submit" className="paie-btn">
//         Enregistrer
//       </button>
//     </form>
//   );
// }














import { useEffect, useState } from "react";
import { getEmployees } from "../api/employeeApi";
import { createPaie } from "../api/paieApi";

export default function PaieForm({ onSaved }) {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    employee_id: "",
    primes: 0,
    heures_supp: 0,
    deductions: 0,
    mois: "",
    annee: ""
  });

  useEffect(() => {
    getEmployees().then((res) => setEmployees(res.data));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      employee_id: form.employee_id,
      mois: form.mois,
      annee: parseInt(form.annee),
      primes: parseFloat(form.primes) || 0,
      heures_supp: parseFloat(form.heures_supp) || 0,
      deductions: parseFloat(form.deductions) || 0
    };

    try {
      await createPaie(payload);
      onSaved();
      setForm({
        employee_id: "",
        primes: 0,
        heures_supp: 0,
        deductions: 0,
        mois: "",
        annee: ""
      });
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de la paie:", error);
      alert("Erreur lors de l'enregistrement. Vérifiez les champs et réessayez.");
    }
  };

  return (
    <form className="paie-form" onSubmit={handleSubmit}>
      <label>Employé</label>
      <select
        name="employee_id"
        value={form.employee_id}
        onChange={handleChange}
        required
      >
        <option value="">Sélectionner un employé</option>
        {employees.map((emp) => (
          <option key={emp.id} value={emp.id}>
            {emp.fullname || `${emp.nom} ${emp.prenom}`}
          </option>
        ))}
      </select>

      <label>Primes</label>
      <input
        type="number"
        name="primes"
        placeholder="Montant des primes"
        value={form.primes}
        onChange={handleChange}
      />

      <label>Heures supplémentaires</label>
      <input
        type="number"
        name="heures_supp"
        placeholder="Nombre d'heures"
        value={form.heures_supp}
        onChange={handleChange}
      />

      <label>Déductions</label>
      <input
        type="number"
        name="deductions"
        placeholder="Montant des déductions"
        value={form.deductions}
        onChange={handleChange}
      />

      <label>Mois</label>
      <input
        type="text"
        name="mois"
        placeholder="Ex: Janvier"
        value={form.mois}
        onChange={handleChange}
        required
      />

      <label>Année</label>
      <input
        type="number"
        name="annee"
        placeholder="Ex: 2025"
        value={form.annee}
        onChange={handleChange}
        required
      />

      <button type="submit" className="paie-btn">
        Enregistrer
      </button>
    </form>
  );
}
