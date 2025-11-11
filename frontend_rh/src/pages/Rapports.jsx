import { useEffect, useState } from "react";
import axios from "axios";

export default function Rapports() {
  const [rapports, setRapports] = useState([]);

  useEffect(() => {
    const fetchRapports = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/rapports/");
        setRapports(res.data);
      } catch (error) {
        console.error("Erreur lors du chargement des rapports :", error);
      }
    };
    fetchRapports();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Rapports RH</h1>
      <ul className="space-y-4">
        {rapports.length > 0 ? (
          rapports.map((r) => (
            <li
              key={r.id}
              className="p-4 bg-white shadow rounded-lg hover:bg-gray-50 transition"
            >
              <h2 className="text-lg font-semibold text-gray-700">{r.titre}</h2>
              <p className="text-gray-500 text-sm mt-1">{r.date}</p>
            </li>
          ))
        ) : (
          <p className="text-gray-500">Aucun rapport disponible.</p>
        )}
      </ul>
    </div>
  );
}
