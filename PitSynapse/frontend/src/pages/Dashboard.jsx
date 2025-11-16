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
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
      {/* Header with animated background */}
      <div className="relative overflow-hidden bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 py-6 mb-8">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative text-center">
          <h1 className="text-5xl font-bold mb-2 text-white drop-shadow-lg">
            🏎️ PitSynapse
          </h1>
          <p className="text-xl text-yellow-100 font-semibold">
            Competitive Mobility Systems Simulator
          </p>
          <p className="text-sm text-yellow-200 mt-2">
            Formula E • MotoGP • Drones • Supply Chain • Traffic Flow
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-8">
        {/* Control Panel */}
        <div className="mb-6 flex justify-center">
          <ControlPanel onStart={runSimulation} />
        </div>

        {/* Status Messages */}
        {loading && (
          <div className="mb-4 p-4 bg-yellow-900 border-2 border-yellow-600 rounded-lg text-center animate-pulse">
            <p className="text-yellow-300 font-semibold text-lg">
              ⏳ Running simulation... Please wait
            </p>
          </div>
        )}
        
        {error && (
          <div className="mb-4 p-4 bg-red-900 border-2 border-red-600 rounded-lg text-center">
            <p className="text-red-300 font-semibold text-lg">❌ Error: {error}</p>
          </div>
        )}

        {/* Summary Card */}
        {summary && (
          <div className="mb-6 p-6 bg-gradient-to-r from-gray-800 to-gray-700 border-2 border-gray-600 rounded-xl shadow-2xl">
            <h2 className="text-2xl font-bold mb-4 text-yellow-400 flex items-center gap-2">
              <span>🏁</span> Race Summary
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <p className="text-gray-400 text-sm mb-1">Winner</p>
                <p className="text-3xl font-bold text-yellow-400">{summary.winner}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-400 text-sm mb-1">Fastest Lap</p>
                <p className="text-3xl font-bold">{summary.fastest_lap}s</p>
              </div>
              <div className="text-center">
                <p className="text-gray-400 text-sm mb-1">Avg Tyre Wear</p>
                <p className="text-3xl font-bold">{summary.avg_tyre_wear}%</p>
              </div>
              <div className="text-center">
                <p className="text-gray-400 text-sm mb-1">Total Laps</p>
                <p className="text-3xl font-bold">{totalLaps || 0}</p>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Playback Controls */}
        {timeline.length > 0 && (
          <div className="mb-6 p-4 bg-gray-800 rounded-xl border-2 border-gray-700">
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <button
                onClick={isPlaying ? pause : play}
                className={`px-8 py-3 rounded-lg font-bold text-lg transition-all transform hover:scale-105 shadow-lg ${
                  isPlaying
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
              >
                {isPlaying ? "⏸ Pause" : "▶ Play"}
              </button>
              <button
                onClick={reset}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold text-lg transition-all transform hover:scale-105 shadow-lg text-white"
              >
                🔄 Reset
              </button>
              <div className="px-6 py-3 bg-gray-700 rounded-lg border-2 border-gray-600">
                <div className="text-gray-400 text-sm">Current Lap</div>
                <div className="font-bold text-2xl text-yellow-400">{currentLap} / {totalLaps}</div>
              </div>
              <div className="px-6 py-3 bg-gray-700 rounded-lg border-2 border-gray-600">
                <div className="text-gray-400 text-sm">Race Time</div>
                <div className="font-bold text-xl text-white">{formatTime(currentTime)}</div>
              </div>
            </div>
          </div>
        )}

        {/* Main Grid */}
        {timeline.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Enhanced Track View */}
            <div className="lg:col-span-2 bg-gray-800 rounded-xl p-6 border-2 border-gray-700 shadow-2xl">
              <h2 className="text-2xl font-bold mb-4 text-yellow-400 flex items-center gap-2">
                <span>📍</span> Live Track View
              </h2>
              <TrackView agents={agents} trackLength={1000} currentLap={currentLap} />
            </div>

            {/* Enhanced Live Leaderboard */}
            <div className="bg-gray-800 rounded-xl p-6 border-2 border-gray-700 shadow-2xl">
              <LiveLeaderboard agents={agents} events={events} />
            </div>

            {/* Charts */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800 rounded-xl p-6 border-2 border-gray-700 shadow-2xl">
                <LapChart agents={chartData.agents} />
              </div>
              <div className="bg-gray-800 rounded-xl p-6 border-2 border-gray-700 shadow-2xl">
                <TyreChart agents={chartData.agents} />
              </div>
            </div>

            {/* Event Log */}
            <div className="bg-gray-800 rounded-xl p-6 border-2 border-gray-700 shadow-2xl">
              <h2 className="text-2xl font-bold mb-4 text-yellow-400 flex items-center gap-2">
                <span>📋</span> Event Log
              </h2>
              <EventLog events={events} />
            </div>
          </div>
        ) : (
          <div className="text-center py-16 bg-gradient-to-br from-gray-800 to-gray-700 rounded-xl border-2 border-gray-600 shadow-2xl">
            <div className="text-8xl mb-6">🚗</div>
            <p className="text-3xl text-gray-300 mb-4 font-bold">Ready to Race!</p>
            <p className="text-gray-400 text-lg">Configure your race above and click "Start Simulation"</p>
            <div className="mt-8 flex justify-center gap-4 text-sm text-gray-500">
              <span>🏎️ Formula E</span>
              <span>🏍️ MotoGP</span>
              <span>🚁 Drones</span>
              <span>📦 Supply Chain</span>
              <span>🚦 Traffic Flow</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
