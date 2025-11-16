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
      const speed = agent.speed || (90 + Math.random() * 20);
      
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
      <div className="w-full bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-2xl border-2 border-slate-700 shadow-2xl backdrop-blur-sm">
        <h2 className="text-2xl font-black mb-4 border-b-2 border-yellow-500 pb-3 text-yellow-400 flex items-center gap-2">
          <span className="text-3xl animate-pulse">🏆</span>
          LIVE LEADERBOARD
        </h2>
        <div className="text-center py-12">
          <div className="text-7xl mb-4 animate-bounce">🚗</div>
          <p className="text-gray-400 text-lg">Waiting for race to start...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-2xl border-2 border-slate-700 shadow-2xl backdrop-blur-sm">
      <h2 className="text-2xl font-black mb-4 border-b-2 border-yellow-500 pb-3 text-yellow-400 flex items-center gap-2">
        <span className="text-3xl animate-pulse">🏆</span>
        LIVE LEADERBOARD
        <span className="ml-auto text-sm font-normal text-gray-400 bg-slate-800 px-3 py-1 rounded-full">
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
              className={`relative flex items-center justify-between px-5 py-4 rounded-xl shadow-lg border-2 transition-all duration-300 transform ${
                agent.isLeader
                  ? "bg-gradient-to-r from-yellow-900/80 to-yellow-800/80 border-yellow-500 scale-105 animate-pulse-glow"
                  : isHighlighted
                  ? "bg-gradient-to-r from-blue-900/80 to-blue-800/80 border-blue-400 scale-102"
                  : "bg-slate-800/70 border-slate-700 hover:bg-slate-750 hover:scale-101"
              } ${isHighlighted ? "animate-pulse" : ""}`}
            >
              {/* Position Badge */}
              <div className={`flex items-center justify-center w-14 h-14 rounded-full font-black text-2xl shadow-lg ${
                agent.isLeader 
                  ? "bg-gradient-to-br from-yellow-400 to-yellow-600 text-black ring-4 ring-yellow-500/50" 
                  : index === 1
                  ? "bg-gradient-to-br from-gray-300 to-gray-500 text-black"
                  : index === 2
                  ? "bg-gradient-to-br from-orange-500 to-orange-700 text-white"
                  : "bg-gradient-to-br from-slate-600 to-slate-800 text-white"
              }`}>
                {index + 1}
              </div>

              {/* Driver Info */}
              <div className="flex-1 ml-4">
                <div className="flex items-center gap-2">
                  <span className="font-black text-lg">{agent.name || agent.id}</span>
                  {positionChange > 0 && (
                    <span className="text-green-400 font-black text-sm bg-green-900/50 px-2 py-1 rounded">↑ {positionChange}</span>
                  )}
                  {positionChange < 0 && (
                    <span className="text-red-400 font-black text-sm bg-red-900/50 px-2 py-1 rounded">↓ {Math.abs(positionChange)}</span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-300 mt-1">
                  <span className="bg-slate-700/50 px-2 py-1 rounded">Lap {agent.lap || 0}/{agent.totalLaps || 0}</span>
                  <span className="text-green-400 font-bold">{agent.speed} km/h</span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 text-right">
                {/* Gap */}
                <div className="w-20">
                  <div className="text-xs text-gray-400 mb-1 font-semibold">Gap</div>
                  <div className={`font-mono font-black text-lg ${
                    agent.isLeader ? "text-yellow-400" : "text-green-400"
                  }`}>
                    {agent.gap}
                  </div>
                </div>

                {/* Tyre Wear */}
                <div className="w-20">
                  <div className="text-xs text-gray-400 mb-1 font-semibold">Tyres</div>
                  <div className={`font-black text-lg ${
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
                    <div className="text-xs text-gray-400 mb-1 font-semibold">Status</div>
                    <div className="text-orange-400 font-black animate-pulse bg-orange-900/50 px-2 py-1 rounded">PIT</div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Events */}
      {recentEvents.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-700">
          <h3 className="text-sm font-black text-gray-400 mb-2 uppercase tracking-wide">Recent Events</h3>
          <div className="space-y-1">
            {recentEvents.slice(-3).reverse().map((event, idx) => (
              <div key={idx} className="text-xs text-gray-500 bg-slate-800/50 px-2 py-1 rounded">
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
