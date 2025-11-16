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

export default function TyreChart({ agents = [] }) {
  const colors = [
    "#60a5fa", // Blue
    "#f472b6", // Pink
    "#34d399", // Green
    "#fbbf24", // Yellow
    "#a78bfa", // Purple
    "#f97316", // Orange
    "#ec4899", // Rose
  ];

  const data = useMemo(() => {
    if (!agents || agents.length === 0) {
      return {
        labels: [],
        datasets: []
      };
    }

    const maxPoints = Math.max(
      ...agents.map((a) => a.tyreHistory?.length || 0),
      1
    );

    return {
      labels: Array.from({ length: maxPoints }, (_, i) => `L${i + 1}`),
      datasets: agents.map((agent, index) => ({
        label: agent.name,
        data: agent.tyreHistory || [],
        borderColor: colors[index % colors.length],
        backgroundColor: colors[index % colors.length] + "33",
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        borderWidth: 3,
        fill: true,
      })),
    };
  }, [agents]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 800,
      easing: "easeInOutCubic",
    },
    plugins: {
      legend: {
        position: "top",
        labels: { 
          color: "#fff",
          font: { size: 12, weight: "bold" },
          padding: 15
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#ddd",
        borderColor: "#444",
        borderWidth: 1,
        padding: 12,
        displayColors: true,
      },
    },
    scales: {
      x: { 
        ticks: { color: "#ddd", font: { size: 11 } },
        grid: { color: "#333" }
      },
      y: {
        ticks: { color: "#ddd", font: { size: 11 } },
        title: {
          display: true,
          text: "Tyre Wear (%)",
          color: "#fff",
          font: { size: 14, weight: "bold" }
        },
        min: 0,
        max: 100,
        grid: { color: "#333" }
      },
    },
  };

  if (!agents || agents.length === 0) {
    return (
      <div className="bg-black p-6 rounded-xl shadow-xl w-full h-64 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-2">🛞</div>
          <p className="text-gray-400">No tyre wear data yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black p-6 rounded-xl shadow-xl w-full" style={{ height: "300px" }}>
      <h2 className="text-white text-xl font-bold mb-4 text-yellow-400">🛞 Tyre Wear Over Time</h2>
      <Line data={data} options={options} />
    </div>
  );
}
