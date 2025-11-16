// src/pages/Dashboard.jsx
import React, { useState } from "react";
import ControlPanel from "../components/ControlPanel";
import TrackView from "../components/TrackView";
import LiveLeaderboard from "../components/LiveLeaderboard";
import LapChart from "../components/LapChart";
import TyreChart from "../components/Tyrechart";
import EventLog from "../components/EventLog";
import { simulateRace } from "../services/api";
import useSimulationPlayer from "../hooks/useSimulationPlayer";

const Dashboard = () => {
  const [params, setParams] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState(null);

  const { agents, currentLap, currentTime, isPlaying, play, pause, reset, totalLaps } = useSimulationPlayer({
    timeline,
    events
  });

  // Handle "Start Simulation" click
  const runSimulation = async (newParams) => {
    setParams(newParams);
    setLoading(true);
    setError(null);
    setTimeline([]);
    setEvents([]);
    setSummary(null);

    try {
      const { data, error: apiError } = await simulateRace(newParams);
      setLoading(false);

      if (apiError) {
        setError(apiError);
        return;
      }

      if (data) {
        setTimeline(data.timeline || []);
        setEvents(data.events || []);
        setSummary(data.summary || null);
        reset(); // Reset player to start
        setTimeout(() => play(), 500); // Start playback after a brief delay
      }
    } catch (err) {
      setLoading(false);
      setError(err.message || "Simulation failed");
    }
  };

  // Transform timeline for charts
  const chartData = React.useMemo(() => {
    if (!timeline || timeline.length === 0) return { agents: [] };
    
    const agentMap = new Map();
    
    timeline.forEach(entry => {
      const agentId = entry.agent_id;
      if (!agentMap.has(agentId)) {
        agentMap.set(agentId, {
          name: agentId,
          lapTimes: [],
          tyreHistory: []
        });
      }
      const agent = agentMap.get(agentId);
      agent.lapTimes.push(entry.lap_time);
      agent.tyreHistory.push(entry.tyre_wear);
    });
    
    return {
      agents: Array.from(agentMap.values())
    };
  }, [timeline]);

  // Format time
  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white relative overflow-hidden">
      {/* Animated background particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Header with animated gradient */}
      <div className="relative overflow-hidden bg-gradient-to-r from-yellow-600 via-yellow-500 to-orange-500 py-8 mb-8 shadow-2xl">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
        <div className="relative text-center z-10">
          <h1 className="text-6xl font-black mb-3 text-white drop-shadow-2xl tracking-tight">
            🏎️ <span className="gradient-text">PitSynapse</span>
          </h1>
          <p className="text-2xl text-yellow-100 font-bold mb-2 drop-shadow-lg">
            Competitive Mobility Systems Simulator
          </p>
          <div className="flex justify-center gap-4 text-sm text-yellow-200 mt-3">
            <span className="px-3 py-1 bg-white/20 rounded-full backdrop-blur-sm">🏎️ Formula E</span>
            <span className="px-3 py-1 bg-white/20 rounded-full backdrop-blur-sm">🏍️ MotoGP</span>
            <span className="px-3 py-1 bg-white/20 rounded-full backdrop-blur-sm">🚁 Drones</span>
            <span className="px-3 py-1 bg-white/20 rounded-full backdrop-blur-sm">📦 Supply Chain</span>
            <span className="px-3 py-1 bg-white/20 rounded-full backdrop-blur-sm">🚦 Traffic Flow</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-8 relative z-10">
        {/* Control Panel */}
        <div className="mb-8 flex justify-center animate-slide-in">
          <ControlPanel onStart={runSimulation} />
        </div>

        {/* Status Messages */}
        {loading && (
          <div className="mb-6 p-6 bg-gradient-to-r from-yellow-900/80 to-orange-900/80 border-2 border-yellow-500/50 rounded-2xl text-center animate-pulse-glow backdrop-blur-sm">
            <p className="text-yellow-200 font-bold text-xl flex items-center justify-center gap-3">
              <span className="animate-spin text-2xl">⏳</span>
              Running simulation... Please wait
            </p>
          </div>
        )}
        
        {error && (
          <div className="mb-6 p-6 bg-gradient-to-r from-red-900/80 to-pink-900/80 border-2 border-red-500/50 rounded-2xl text-center backdrop-blur-sm">
            <p className="text-red-200 font-bold text-xl flex items-center justify-center gap-3">
              <span className="text-2xl">❌</span>
              Error: {error}
            </p>
          </div>
        )}

        {/* Enhanced Summary Card */}
        {summary && (
          <div className="mb-8 p-8 bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-2 border-yellow-500/30 rounded-2xl shadow-2xl backdrop-blur-sm card-hover animate-slide-in">
            <h2 className="text-3xl font-black mb-6 text-yellow-400 flex items-center gap-3">
              <span className="text-4xl">🏁</span>
              Race Summary
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-slate-800/50 rounded-xl border border-yellow-500/20">
                <p className="text-gray-400 text-sm mb-2 font-semibold uppercase tracking-wide">Winner</p>
                <p className="text-4xl font-black text-yellow-400">{summary.winner}</p>
              </div>
              <div className="text-center p-4 bg-slate-800/50 rounded-xl border border-blue-500/20">
                <p className="text-gray-400 text-sm mb-2 font-semibold uppercase tracking-wide">Fastest Lap</p>
                <p className="text-4xl font-black text-blue-400">{summary.fastest_lap}s</p>
              </div>
              <div className="text-center p-4 bg-slate-800/50 rounded-xl border border-green-500/20">
                <p className="text-gray-400 text-sm mb-2 font-semibold uppercase tracking-wide">Avg Tyre Wear</p>
                <p className="text-4xl font-black text-green-400">{summary.avg_tyre_wear}%</p>
              </div>
              <div className="text-center p-4 bg-slate-800/50 rounded-xl border border-purple-500/20">
                <p className="text-gray-400 text-sm mb-2 font-semibold uppercase tracking-wide">Total Laps</p>
                <p className="text-4xl font-black text-purple-400">{totalLaps || 0}</p>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Playback Controls */}
        {timeline.length > 0 && (
          <div className="mb-8 p-6 bg-gradient-to-r from-slate-800/90 to-slate-700/90 rounded-2xl border-2 border-slate-600/50 shadow-xl backdrop-blur-sm animate-slide-in">
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <button
                onClick={isPlaying ? pause : play}
                className={`px-8 py-4 rounded-xl font-black text-lg transition-all transform hover:scale-110 shadow-2xl ${
                  isPlaying
                    ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
                    : "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
                }`}
              >
                {isPlaying ? "⏸ Pause" : "▶ Play"}
              </button>
              <button
                onClick={reset}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl font-black text-lg transition-all transform hover:scale-110 shadow-2xl text-white"
              >
                🔄 Reset
              </button>
              <div className="px-8 py-4 bg-slate-800/70 rounded-xl border-2 border-slate-600/50 backdrop-blur-sm">
                <div className="text-gray-400 text-sm mb-1 font-semibold">Current Lap</div>
                <div className="font-black text-3xl text-yellow-400">{currentLap} <span className="text-xl text-gray-400">/ {totalLaps}</span></div>
              </div>
              <div className="px-8 py-4 bg-slate-800/70 rounded-xl border-2 border-slate-600/50 backdrop-blur-sm">
                <div className="text-gray-400 text-sm mb-1 font-semibold">Race Time</div>
                <div className="font-black text-2xl text-white">{formatTime(currentTime)}</div>
              </div>
            </div>
          </div>
        )}

        {/* Main Grid */}
        {timeline.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
            {/* Enhanced Track View */}
            <div className="lg:col-span-2 bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-2xl p-6 border-2 border-slate-700/50 shadow-2xl backdrop-blur-sm card-hover">
              <h2 className="text-2xl font-black mb-4 text-yellow-400 flex items-center gap-3">
                <span className="text-3xl">📍</span>
                Live Track View
              </h2>
              <TrackView agents={agents} trackLength={1000} currentLap={currentLap} />
            </div>

            {/* Enhanced Live Leaderboard */}
            <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-2xl p-6 border-2 border-slate-700/50 shadow-2xl backdrop-blur-sm card-hover">
              <LiveLeaderboard agents={agents} events={events} />
            </div>

            {/* Charts */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-2xl p-6 border-2 border-slate-700/50 shadow-2xl backdrop-blur-sm card-hover">
                <LapChart agents={chartData.agents} />
              </div>
              <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-2xl p-6 border-2 border-slate-700/50 shadow-2xl backdrop-blur-sm card-hover">
                <TyreChart agents={chartData.agents} />
              </div>
            </div>

            {/* Event Log */}
            <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-2xl p-6 border-2 border-slate-700/50 shadow-2xl backdrop-blur-sm card-hover">
              <h2 className="text-2xl font-black mb-4 text-yellow-400 flex items-center gap-3">
                <span className="text-3xl">📋</span>
                Event Log
              </h2>
              <EventLog events={events} />
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-2xl border-2 border-slate-700/50 shadow-2xl backdrop-blur-sm animate-fade-in">
            <div className="text-9xl mb-8 animate-bounce">🚗</div>
            <p className="text-4xl text-gray-200 mb-6 font-black">Ready to Race!</p>
            <p className="text-gray-400 text-xl mb-8">Configure your race above and click "Start Simulation"</p>
            <div className="flex justify-center gap-4 text-sm text-gray-500 flex-wrap">
              <span className="px-4 py-2 bg-slate-800/50 rounded-full">🏎️ Formula E</span>
              <span className="px-4 py-2 bg-slate-800/50 rounded-full">🏍️ MotoGP</span>
              <span className="px-4 py-2 bg-slate-800/50 rounded-full">🚁 Drones</span>
              <span className="px-4 py-2 bg-slate-800/50 rounded-full">📦 Supply Chain</span>
              <span className="px-4 py-2 bg-slate-800/50 rounded-full">🚦 Traffic Flow</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
