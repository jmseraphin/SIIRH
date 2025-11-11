import { useEffect, useState } from "react";
import axios from "axios";

export default function Paie() {
  const [paies, setPaies] = useState([]);

  useEffect(() => {
    const fetchPaies = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/paie/");
        setPaies(res.data);
      } catch (error) {
        console.error("Erreur lors du chargement de la paie :", error);
      }
    };
    fetchPaies();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Gestion de la Paie</h1>
      <table className="w-full bg-white shadow rounded-lg">
        <thead>
          <tr className="bg-gray-100 text-left text-gray-700">
            <th className="p-3">Employé</th>
            <th className="p-3">Salaire</th>
            <th className="p-3">Mois</th>
          </tr>
        </thead>
        <tbody>
          {paies.length > 0 ? (
            paies.map((p) => (
              <tr key={p.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{p.employe_nom}</td>
                <td className="p-3">{p.salaire} Ar</td>
                <td className="p-3">{p.mois}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="p-3 text-center text-gray-500">
                Aucune fiche de paie trouvée.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
