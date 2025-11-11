// import DashboardLayout from "../components/DashboardLayout";

// export default function CandidatureList() {
//   return (
//     <DashboardLayout>
//       <h2 className="text-2xl font-bold mb-4 text-blue-700">Liste des Candidatures</h2>
//       <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
//         <thead className="bg-blue-700 text-white">
//           <tr>
//             <th className="py-2 px-4">Rang</th>
//             <th className="py-2 px-4">Nom</th>
//             <th className="py-2 px-4">Prénom</th>
//             <th className="py-2 px-4">Poste</th>
//             <th className="py-2 px-4">Date</th>
//             <th className="py-2 px-4">Score</th>
//             <th className="py-2 px-4">Statut</th>
//             <th className="py-2 px-4">Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {/* ohatra fotsiny */}
//           <tr className="border-b">
//             <td className="py-2 px-4">1</td>
//             <td className="py-2 px-4">JAYA</td>
//             <td className="py-2 px-4">FELINE</td>
//             <td className="py-2 px-4">Développeur</td>
//             <td className="py-2 px-4">14/10/2025</td>
//             <td className="py-2 px-4">50</td>
//             <td className="py-2 px-4 text-green-600 font-semibold">Sélectionné</td>
//             <td className="py-2 px-4">
//               <button className="bg-green-600 text-white px-3 py-1 rounded mr-2 hover:bg-green-500">Sélectionner</button>
//               <button className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-500">Refuser</button>
//             </td>
//           </tr>
//         </tbody>
//       </table>
//     </DashboardLayout>
//   );
// }


import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { FaStar } from "react-icons/fa";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function ListeEntretiens() {
  const [entretiens, setEntretiens] = useState([]);
  const [filter, setFilter] = useState("Tous");
  const [search, setSearch] = useState("");

  // 🔹 Charger les entretiens depuis localStorage et trier par score
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("entretiens") || "[]");
    data.sort((a, b) => (b.score || 0) - (a.score || 0));
    setEntretiens(data);
  }, []);

  // 🔹 Mettre à jour le statut (Sélectionné / Refusé)
  const handleAction = (id, action) => {
    const updated = entretiens.map((e) =>
      e.id === id ? { ...e, statut: action } : e
    );
    setEntretiens(updated);
    localStorage.setItem("entretiens", JSON.stringify(updated));
  };

  // 🔹 Affichage des étoiles
  const renderStars = (score) => (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((i) => (
        <FaStar
          key={i}
          size={16}
          color={i <= score ? "#f5b301" : "#ccc"}
          style={{ marginRight: 2 }}
        />
      ))}
    </div>
  );

  // 🔹 Filtrage et recherche
  const filteredEntretiens = entretiens.filter((e) => {
    const matchStatut = filter === "Tous" || e.statut === filter;
    const matchSearch =
      e.nom.toLowerCase().includes(search.toLowerCase()) ||
      e.poste.toLowerCase().includes(search.toLowerCase());
    return matchStatut && matchSearch;
  });

  // 🔹 Export PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Liste des Entretiens - SIIRH", 14, 16);
    const tableColumn = ["Rang", "Nom", "Poste", "Date", "Score", "Statut"];
    const tableRows = [];

    filteredEntretiens.forEach((e, index) => {
      tableRows.push([
        index + 1,
        e.nom,
        e.poste,
        e.date,
        e.score,
        e.statut || "En attente",
      ]);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("liste_entretiens.pdf");
  };

  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold mb-4 text-blue-700">
        Liste des Entretiens
      </h2>

      <div className="flex mb-4 space-x-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="Tous">Tous</option>
          <option value="En attente">En attente</option>
          <option value="Sélectionné">Sélectionné</option>
          <option value="Refusé">Refusé</option>
        </select>

        <input
          type="text"
          placeholder="Rechercher par nom ou poste..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border rounded flex-1"
        />

        <button
          onClick={exportPDF}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
        >
          Exporter PDF
        </button>
      </div>

      <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
        <thead className="bg-blue-700 text-white">
          <tr>
            <th className="py-2 px-4">Rang</th>
            <th className="py-2 px-4">Nom</th>
            <th className="py-2 px-4">Poste</th>
            <th className="py-2 px-4">Date</th>
            <th className="py-2 px-4">Score</th>
            <th className="py-2 px-4">Statut</th>
            <th className="py-2 px-4">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredEntretiens.length === 0 && (
            <tr>
              <td colSpan={7} className="text-center py-4">
                Aucun entretien trouvé
              </td>
            </tr>
          )}
          {filteredEntretiens.map((e, index) => (
            <tr key={e.id} className="border-b">
              <td className="py-2 px-4">{index + 1}</td>
              <td className="py-2 px-4">{e.nom}</td>
              <td className="py-2 px-4">{e.poste}</td>
              <td className="py-2 px-4">{e.date}</td>
              <td className="py-2 px-4">{renderStars(e.score)}</td>
              <td className="py-2 px-4 font-semibold text-green-600">
                {e.statut || "En attente"}
              </td>
              <td className="py-2 px-4">
                <button
                  className="bg-green-600 text-white px-3 py-1 rounded mr-2 hover:bg-green-500"
                  onClick={() => handleAction(e.id, "Sélectionné")}
                >
                  Sélectionner
                </button>
                <button
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-500"
                  onClick={() => handleAction(e.id, "Refusé")}
                >
                  Refuser
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </DashboardLayout>
  );
}
