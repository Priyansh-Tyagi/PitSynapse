// TyreChart.jsx
import React, { useMemo } from "react";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

export default function TyreChart({ agents }) {
  const colors = [
    "#FF3B3B",
    "#3B82F6",
    "#22C55E",
    "#EAB308",
    "#A855F7",
    "#F97316",
    "#EC4899",
  ];

  const data = useMemo(() => {
    if (!agents || agents.length === 0) return {};

    const maxPoints = Math.max(
      ...agents.map((a) => a.tyreHistory?.length || 0)
    );

    return {
      labels: Array.from({ length: maxPoints }, (_, i) => `T${i + 1}`),
      datasets: agents.map((agent, index) => ({
        label: agent.name,
        data: agent.tyreHistory || [],
        borderColor: colors[index % colors.length],
        backgroundColor: colors[index % colors.length] + "55",
        tension: 0.35,
        pointRadius: 3,
        borderWidth: 2,
      })),
    };
  }, [agents]);

  const options = {
    responsive: true,
    animation: {
      duration: 600,
      easing: "easeInOutCubic",
    },
    plugins: {
      legend: {
        position: "top",
        labels: { color: "#fff" },
      },
      tooltip: {
        backgroundColor: "#111",
        titleColor: "#fff",
        bodyColor: "#ddd",
      },
    },
    scales: {
      x: { ticks: { color: "#ddd" } },
      y: {
        ticks: { color: "#ddd" },
        title: {
          display: true,
          text: "Tyre Wear (%)",
          color: "#fff",
        },
        min: 0,
        max: 100,
      },
    },
  };

  return (
    <div className="bg-black p-4 rounded-xl shadow-xl w-full">
      <h2 className="text-white text-lg font-bold mb-3">Tyre Wear Over Time</h2>
      <Line data={data} options={options} />
    </div>
  );
}
