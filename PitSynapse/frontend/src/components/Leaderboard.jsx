import React, { useEffect, useMemo, useState } from "react";

export default function Leaderboard({ agents }) {
  const [sortedAgents, setSortedAgents] = useState([]);

  // Auto-sort every tick without re-render storm
  useEffect(() => {
    if (!agents) return;

    // Sort by lap completed → then by distance (position)
    const sorted = [...agents].sort((a, b) => {
      const lapA = a.lap ?? 0;
      const lapB = b.lap ?? 0;

      if (lapA !== lapB) return lapB - lapA; // higher lap first
      return b.position - a.position; // farther distance first
    });

    setSortedAgents(sorted);
  }, [agents]);

  // Compute time delta between P1 & others
  const deltas = useMemo(() => {
    if (!sortedAgents.length) return [];
    const leader = sortedAgents[0];

    return sortedAgents.map((agent) => {
      if (agent === leader) return "+0.000s";
      const diff = (leader.time - agent.time).toFixed(3);
      return `+${diff}s`;
    });
  }, [sortedAgents]);

  return (
    <div className="w-64 bg-black text-white p-3 rounded-xl shadow-xl font-mono">
      <h2 className="text-lg font-bold mb-3 border-b border-gray-700 pb-2">
        LIVE LEADERBOARD
      </h2>

      <div className="space-y-2">
        {sortedAgents.map((agent, index) => (
          <div
            key={agent.name}
            className="flex items-center justify-between bg-gray-900 px-3 py-2 rounded-lg shadow border border-gray-800"
          >
            {/* Position Number */}
            <div className="text-yellow-400 font-bold w-6">
              {index + 1}
            </div>

            {/* Driver Name */}
            <div className="flex-1 ml-2 font-semibold text-sm truncate">
              {agent.name}
            </div>

            {/* Lap progress */}
            <div className="text-xs text-gray-300 w-14 text-right">
              Lap {agent.lap}/{agent.totalLaps}
            </div>

            {/* Time Delta */}
            <div className="text-xs text-green-400 w-16 text-right">
              {deltas[index]}
            </div>

            {/* Tyre Wear */}
            <div className="text-xs text-red-400 font-bold w-10 text-right">
              {agent.tyreWear ?? 0}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
