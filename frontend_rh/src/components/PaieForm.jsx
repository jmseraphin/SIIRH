// // PaieForm.jsx
// import React, { forwardRef, useEffect, useState, useImperativeHandle } from "react";
// import { getEmployees } from "../api/employeeApi";
// import { createPaie } from "../api/paieApi";

// const PaieForm = forwardRef(({ onSaved }, ref) => {
//   const [employees, setEmployees] = useState([]);
//   const [form, setForm] = useState({
//     employee_id: "",
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
//     const { name, value } = e.target;
//     setForm({ ...form, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     if (e.preventDefault) e.preventDefault();
//     const payload = {
//       employee_id: form.employee_id,
//       mois: form.mois,
//       annee: parseInt(form.annee),
//       primes: parseFloat(form.primes) || 0,
//       heures_supp: parseFloat(form.heures_supp) || 0,
//       deductions: parseFloat(form.deductions) || 0
//     };
//     try {
//       await createPaie(payload);
//       onSaved();
//       setForm({
//         employee_id: "",
//         primes: 0,
//         heures_supp: 0,
//         deductions: 0,
//         mois: "",
//         annee: ""
//       });
//     } catch (err) {
//       console.error(err);
//       alert("Erreur lors de l'enregistrement. Vérifiez les champs et réessayez.");
//     }
//   };

//   // Expose submit ho any amin'ny parent ref
//   useImperativeHandle(ref, () => ({
//     submit: () => handleSubmit({ preventDefault: () => {} })
//   }));

//   return (
//     <form onSubmit={handleSubmit} className="paie-form">
//       <label>Employé</label>
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

//       <label>Primes</label>
//       <input
//         type="number"
//         name="primes"
//         placeholder="Montant des primes"
//         value={form.primes}
//         onChange={handleChange}
//       />

//       <label>Heures supplémentaires</label>
//       <input
//         type="number"
//         name="heures_supp"
//         placeholder="Nombre d'heures"
//         value={form.heures_supp}
//         onChange={handleChange}
//       />

//       <label>Déductions</label>
//       <input
//         type="number"
//         name="deductions"
//         placeholder="Montant des déductions"
//         value={form.deductions}
//         onChange={handleChange}
//       />

//       <label>Mois</label>
//       <input
//         type="text"
//         name="mois"
//         placeholder="Ex: Janvier"
//         value={form.mois}
//         onChange={handleChange}
//         required
//       />

//       <label>Année</label>
//       <input
//         type="number"
//         name="annee"
//         placeholder="Ex: 2025"
//         value={form.annee}
//         onChange={handleChange}
//         required
//       />
//     </form>
//   );
// });

// export default PaieForm;

























// PaieForm.jsx
import React, { forwardRef, useEffect, useState, useImperativeHandle } from "react";
import { getEmployees } from "../api/employeeApi";
import { createPaie } from "../api/paieApi";

const PaieForm = forwardRef(({ onSaved }, ref) => {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    employee_id: "",
    primes: 0,
    heures_supp: 0,
    deductions: 0,
    mois: "",
    annee: ""
  });
  const [employeeInput, setEmployeeInput] = useState(""); // searchable input
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    getEmployees().then((res) => setEmployees(res.data));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    if (e.preventDefault) e.preventDefault();
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
      setEmployeeInput("");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'enregistrement. Vérifiez les champs et réessayez.");
    }
  };

  // ForwardRef submit
  useImperativeHandle(ref, () => ({
    submit: () => handleSubmit({ preventDefault: () => {} })
  }));

  // Filter employees based on input
  const filteredEmployees = employees.filter(emp => {
    const name = emp.fullname || `${emp.nom} ${emp.prenom}`;
    return name.toLowerCase().includes(employeeInput.toLowerCase());
  });

  return (
    <form onSubmit={handleSubmit} className="paie-form">
      <label>Employé</label>
      <div style={{ position: "relative", width: "100%" }}>
        <input
          type="text"
          placeholder="Sélectionner un employé"
          value={employeeInput}
          onChange={(e) => {
            setEmployeeInput(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 100)} // delay to allow click
          style={{
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #bbb",
            width: "100%",
            marginBottom: "5px"
          }}
          required
        />
        {showDropdown && filteredEmployees.length > 0 && (
          <ul
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              maxHeight: "150px",
              overflowY: "auto",
              backgroundColor: "#fff",
              border: "1px solid #bbb",
              borderRadius: "6px",
              zIndex: 1000,
              margin: 0,
              padding: 0,
              listStyle: "none"
            }}
          >
            {filteredEmployees.map(emp => {
              const name = emp.fullname || `${emp.nom} ${emp.prenom}`;
              return (
                <li
                  key={emp.id}
                  style={{ padding: "8px", cursor: "pointer" }}
                  onMouseDown={() => {
                    setForm({ ...form, employee_id: emp.id });
                    setEmployeeInput(name);
                    setShowDropdown(false);
                  }}
                >
                  {name}
                </li>
              );
            })}
          </ul>
        )}
      </div>

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
      <select
        name="annee"
        value={form.annee}
        onChange={handleChange}
        required
      >
        <option value="">Sélectionner une année</option>
        {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(year => (
          <option key={year} value={year}>{year}</option>
        ))}
      </select>
    </form>
  );
});

export default PaieForm;
