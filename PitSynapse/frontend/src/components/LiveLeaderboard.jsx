import React, { useMemo, useEffect, useState } from "react";

export default function LiveLeaderboard({ agents = [], events = [] }) {
  const [highlightedAgent, setHighlightedAgent] = useState(null);
  const [recentEvents, setRecentEvents] = useState([]);

  useEffect(() => {
    // Show recent events
    if (events && events.length > 0) {
      const latest = events.slice(-5);
      setRecentEvents(latest);
      
      // Highlight agent if there's an event
      if (latest.length > 0) {
        const event = latest[latest.length - 1];
        if (event.agent_id) {
          setHighlightedAgent(event.agent_id);
          setTimeout(() => setHighlightedAgent(null), 2000);
        }
      }
    }
  }, [events]);

  // Sort agents by position
  const sortedAgents = useMemo(() => {
    if (!agents || agents.length === 0) return [];
    return [...agents].sort((a, b) => {
      const lapA = a.lap || 0;
      const lapB = b.lap || 0;
      if (lapA !== lapB) return lapB - lapA;
      return a.position - b.position;
    });
  }, [agents]);

  // Calculate gaps and speeds
  const leaderboardData = useMemo(() => {
    if (!sortedAgents.length) return [];
    
    const leader = sortedAgents[0];
    const leaderTime = leader.lapTime || 0;

    return sortedAgents.map((agent, index) => {
      const agentTime = agent.lapTime || 0;
      const gap = index === 0 ? 0 : (agentTime - leaderTime).toFixed(3);
      const speed = agent.speed || (90 + Math.random() * 20); // Simulated speed
      
      return {
        ...agent,
        gap: index === 0 ? "---" : `+${gap}s`,
        speed: speed.toFixed(1),
        isLeader: index === 0,
        positionChange: agent.positionChange || 0
      };
    });
  }, [sortedAgents]);

  if (sortedAgents.length === 0) {
    return (
      <div className="w-full bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6 rounded-xl border-2 border-gray-700 shadow-2xl">
        <h2 className="text-2xl font-bold mb-4 border-b-2 border-yellow-500 pb-3 text-yellow-400 flex items-center gap-2">
          <span className="text-3xl">🏆</span>
          LIVE LEADERBOARD
        </h2>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🚗</div>
          <p className="text-gray-400 text-lg">Waiting for race to start...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6 rounded-xl border-2 border-gray-700 shadow-2xl">
      <h2 className="text-2xl font-bold mb-4 border-b-2 border-yellow-500 pb-3 text-yellow-400 flex items-center gap-2">
        <span className="text-3xl animate-pulse">🏆</span>
        LIVE LEADERBOARD
        <span className="ml-auto text-sm font-normal text-gray-400">
          {sortedAgents.length} Competitors
        </span>
      </h2>

      <div className="space-y-3">
        {leaderboardData.map((agent, index) => {
          const isHighlighted = highlightedAgent === agent.id;
          const positionChange = agent.positionChange || 0;
          
          return (
            <div
              key={agent.id || index}
              className={`relative flex items-center justify-between px-4 py-4 rounded-lg shadow-lg border-2 transition-all duration-300 transform ${
                agent.isLeader
                  ? "bg-gradient-to-r from-yellow-900 to-yellow-800 border-yellow-500 scale-105"
                  : isHighlighted
                  ? "bg-gradient-to-r from-blue-900 to-blue-800 border-blue-400 scale-102"
                  : "bg-gray-800 border-gray-700 hover:bg-gray-750 hover:scale-101"
              } ${isHighlighted ? "animate-pulse" : ""}`}
            >
              {/* Position Badge */}
              <div className={`flex items-center justify-center w-12 h-12 rounded-full font-bold text-xl ${
                agent.isLeader 
                  ? "bg-yellow-500 text-black" 
                  : index === 1
                  ? "bg-gray-400 text-black"
                  : index === 2
                  ? "bg-orange-600 text-white"
                  : "bg-gray-600 text-white"
              }`}>
                {index + 1}
              </div>

              {/* Driver Info */}
              <div className="flex-1 ml-4">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg">{agent.name || agent.id}</span>
                  {positionChange > 0 && (
                    <span className="text-green-400 font-bold text-sm">↑ {positionChange}</span>
                  )}
                  {positionChange < 0 && (
                    <span className="text-red-400 font-bold text-sm">↓ {Math.abs(positionChange)}</span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-300 mt-1">
                  <span>Lap {agent.lap || 0}/{agent.totalLaps || 0}</span>
                  <span className="text-green-400">{agent.speed} km/h</span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 text-right">
                {/* Gap */}
                <div className="w-20">
                  <div className="text-xs text-gray-400 mb-1">Gap</div>
                  <div className={`font-mono font-bold ${
                    agent.isLeader ? "text-yellow-400" : "text-green-400"
                  }`}>
                    {agent.gap}
                  </div>
                </div>

                {/* Tyre Wear */}
                <div className="w-20">
                  <div className="text-xs text-gray-400 mb-1">Tyres</div>
                  <div className={`font-bold ${
                    agent.tyreWear > 70 ? "text-red-400" 
                    : agent.tyreWear > 40 ? "text-yellow-400" 
                    : "text-green-400"
                  }`}>
                    {agent.tyreWear ? `${agent.tyreWear.toFixed(1)}%` : "100%"}
                  </div>
                </div>

                {/* Status Indicator */}
                {agent.isPitting && (
                  <div className="w-16 text-center">
                    <div className="text-xs text-gray-400 mb-1">Status</div>
                    <div className="text-orange-400 font-bold animate-pulse">PIT</div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Events */}
      {recentEvents.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <h3 className="text-sm font-bold text-gray-400 mb-2">Recent Events</h3>
          <div className="space-y-1">
            {recentEvents.slice(-3).reverse().map((event, idx) => (
              <div key={idx} className="text-xs text-gray-500">
                {event.event_type === "overtake" && "🏎️ Overtake"}
                {event.event_type === "pit_stop" && "🛠️ Pit Stop"}
                {event.event_type === "lap_complete" && "🏁 Lap Complete"}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

