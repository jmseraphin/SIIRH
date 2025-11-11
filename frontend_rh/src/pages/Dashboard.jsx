import { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Users, FileText, Briefcase } from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalEmployes: 0,
    totalContrats: 0,
    totalCandidatures: 0,
    moyenneScore: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/recrutement/rh/dashboard");
        setStats(res.data);
      } catch (error) {
        console.error("Erreur lors du chargement des statistiques :", error);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    {
      title: "Employés",
      value: stats.totalEmployes,
      icon: <Users size={32} className="text-blue-500" />,
      color: "bg-blue-50",
    },
    {
      title: "Contrats",
      value: stats.totalContrats,
      icon: <FileText size={32} className="text-green-500" />,
      color: "bg-green-50",
    },
    {
      title: "Candidatures",
      value: stats.totalCandidatures,
      icon: <Briefcase size={32} className="text-yellow-500" />,
      color: "bg-yellow-50",
    },
    {
      title: "Score Moyen",
      value: stats.moyenneScore.toFixed(2),
      icon: <BarChart size={32} className="text-purple-500" />,
      color: "bg-purple-50",
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Tableau de Bord RH</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div
            key={card.title}
            className={`${card.color} p-4 rounded-xl shadow hover:shadow-md transition`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-700">{card.title}</h2>
                <p className="text-3xl font-bold text-gray-900">{card.value}</p>
              </div>
              {card.icon}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
