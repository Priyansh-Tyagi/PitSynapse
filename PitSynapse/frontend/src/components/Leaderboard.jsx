import React, { useMemo } from "react";

export default function Leaderboard({ agents = [] }) {
  // Sort agents by position
  const sortedAgents = useMemo(() => {
    if (!agents || agents.length === 0) return [];
    return [...agents].sort((a, b) => {
      // First by lap (higher is better)
      const lapA = a.lap || 0;
      const lapB = b.lap || 0;
      if (lapA !== lapB) return lapB - lapA;
      
      // Then by position (lower is better)
      return a.position - b.position;
    });
  }, [agents]);

  // Compute time delta between leader & others
  const deltas = useMemo(() => {
    if (!sortedAgents.length) return [];
    const leader = sortedAgents[0];
    const leaderTime = leader.lapTime || 0;

    return sortedAgents.map((agent) => {
      if (agent === leader) return "+0.000s";
      const agentTime = agent.lapTime || 0;
      const diff = (agentTime - leaderTime).toFixed(3);
      return `+${diff}s`;
    });
  }, [sortedAgents]);

  if (sortedAgents.length === 0) {
    return (
      <div className="w-full bg-gray-900 text-white p-4 rounded-lg border border-gray-700">
        <h2 className="text-lg font-bold mb-3 border-b border-gray-700 pb-2 text-yellow-400">
          🏆 LIVE LEADERBOARD
        </h2>
        <p className="text-gray-400 text-center py-8">No agents yet</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-900 text-white p-4 rounded-lg border border-gray-700">
      <h2 className="text-lg font-bold mb-3 border-b border-gray-700 pb-2 text-yellow-400">
        🏆 LIVE LEADERBOARD
      </h2>

      <div className="space-y-2">
        {sortedAgents.map((agent, index) => (
          <div
            key={agent.id || index}
            className={`flex items-center justify-between px-4 py-3 rounded-lg shadow border transition-all ${
              index === 0 
                ? "bg-yellow-900 border-yellow-600" 
                : "bg-gray-800 border-gray-700 hover:bg-gray-750"
            }`}
          >
            {/* Position Number */}
            <div className={`font-bold w-8 text-lg ${
              index === 0 ? "text-yellow-400" : "text-gray-400"
            }`}>
              {index + 1}
            </div>

            {/* Driver Name */}
            <div className="flex-1 ml-3 font-semibold text-sm truncate">
              {agent.name || agent.id}
            </div>

            {/* Lap progress */}
            <div className="text-xs text-gray-300 w-16 text-right">
              Lap {agent.lap || 0}/{agent.totalLaps || 0}
            </div>

            {/* Time Delta */}
            <div className={`text-xs w-20 text-right font-mono ${
              index === 0 ? "text-yellow-400" : "text-green-400"
            }`}>
              {deltas[index] || "+0.000s"}
            </div>

            {/* Tyre Wear */}
            <div className="text-xs font-bold w-14 text-right">
              <span className={agent.tyreWear > 70 ? "text-red-400" : agent.tyreWear > 40 ? "text-yellow-400" : "text-green-400"}>
                {agent.tyreWear ? `${agent.tyreWear.toFixed(1)}%` : "0%"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
