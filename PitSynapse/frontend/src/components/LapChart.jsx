// LapChart.jsx
import React, { useMemo } from "react";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler
);

export default function LapChart({ agents = [] }) {
  // Enhanced color palette with gradients
  const colors = [
    { border: "#60a5fa", bg: "rgba(96, 165, 250, 0.1)" }, // Blue
    { border: "#f472b6", bg: "rgba(244, 114, 182, 0.1)" }, // Pink
    { border: "#34d399", bg: "rgba(52, 211, 153, 0.1)" }, // Green
    { border: "#fbbf24", bg: "rgba(251, 191, 36, 0.1)" }, // Yellow
    { border: "#a78bfa", bg: "rgba(167, 139, 250, 0.1)" }, // Purple
    { border: "#f97316", bg: "rgba(249, 115, 22, 0.1)" }, // Orange
    { border: "#ec4899", bg: "rgba(236, 72, 153, 0.1)" }, // Rose
  ];

  const data = useMemo(() => {
    if (!agents || agents.length === 0) {
      return {
        labels: [],
        datasets: []
      };
    }

    const maxLaps = Math.max(
      ...agents.map((a) => a.lapTimes?.length || 0),
      1
    );

    return {
      labels: Array.from({ length: maxLaps }, (_, i) => `Lap ${i + 1}`),
      datasets: agents.map((agent, index) => {
        const color = colors[index % colors.length];
        return {
          label: agent.name,
          data: agent.lapTimes || [],
          borderColor: color.border,
          backgroundColor: color.bg,
          tension: 0.4,
          pointRadius: 5,
          pointHoverRadius: 8,
          pointHoverBorderWidth: 3,
          borderWidth: 3,
          fill: true,
          pointBackgroundColor: color.border,
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
        };
      }),
    };
  }, [agents]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000,
      easing: "easeInOutQuad",
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
    plugins: {
      legend: {
        position: "top",
        labels: { 
          color: "#fff",
          font: { size: 13, weight: "bold", family: "'Inter', sans-serif" },
          padding: 18,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.95)",
        titleColor: "#fbbf24",
        bodyColor: "#fff",
        borderColor: "#fbbf24",
        borderWidth: 2,
        padding: 14,
        displayColors: true,
        titleFont: { size: 14, weight: "bold" },
        bodyFont: { size: 13 },
        cornerRadius: 12,
        boxPadding: 8,
      },
    },
    scales: {
      x: { 
        ticks: { 
          color: "#94a3b8", 
          font: { size: 11, weight: "500" },
          maxRotation: 45,
          minRotation: 0,
        },
        grid: { 
          color: "rgba(148, 163, 184, 0.1)",
          drawBorder: false,
        },
        border: {
          color: "rgba(148, 163, 184, 0.2)",
        }
      },
      y: {
        ticks: { 
          color: "#94a3b8", 
          font: { size: 11, weight: "500" },
        },
        title: {
          display: true,
          text: "Lap Time (seconds)",
          color: "#fbbf24",
          font: { size: 14, weight: "bold", family: "'Inter', sans-serif" }
        },
        grid: { 
          color: "rgba(148, 163, 184, 0.1)",
          drawBorder: false,
        },
        border: {
          color: "rgba(148, 163, 184, 0.2)",
        }
      },
    },
  };

  if (!agents || agents.length === 0) {
    return (
      <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 p-8 rounded-2xl shadow-2xl w-full h-80 flex items-center justify-center border-2 border-slate-700/50 backdrop-blur-sm">
        <div className="text-center">
          <div className="text-7xl mb-4 animate-bounce">📊</div>
          <p className="text-gray-400 text-lg font-semibold">No lap time data yet</p>
          <p className="text-gray-500 text-sm mt-2">Data will appear during the race</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 p-6 rounded-2xl shadow-2xl w-full border-2 border-slate-700/50 backdrop-blur-sm" style={{ height: "350px" }}>
      <h2 className="text-2xl font-black mb-4 text-yellow-400 flex items-center gap-3">
        <span className="text-3xl">⏱️</span>
        Lap Times
      </h2>
      <div className="h-[280px]">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
