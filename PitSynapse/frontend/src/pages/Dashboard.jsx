// src/pages/Dashboard.jsx
import React, { useState } from "react";
import ControlPanel from "../components/ControlPanel";
import TrackView from "../components/TrackView";
import Leaderboard from "../components/Leaderboard";
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

  const { agents, currentLap, isPlaying, play, pause, reset } = useSimulationPlayer({
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
        setTimeout(() => play(), 100); // Start playback after a brief delay
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

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      {/* Header */}
      <div className="mb-6 text-center">
        <h1 className="text-4xl font-bold mb-2 text-yellow-400">PitSynapse</h1>
        <p className="text-gray-400 text-lg">Multi-Agent Race Simulation</p>
      </div>

      {/* Control Panel */}
      <div className="mb-6 flex justify-center">
        <ControlPanel onStart={runSimulation} />
      </div>

      {/* Status Messages */}
      {loading && (
        <div className="mb-4 p-4 bg-yellow-900 border border-yellow-600 rounded-lg text-center">
          <p className="text-yellow-300 font-semibold">⏳ Simulation running... Please wait</p>
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-4 bg-red-900 border border-red-600 rounded-lg text-center">
          <p className="text-red-300 font-semibold">❌ Error: {error}</p>
        </div>
      )}

      {/* Summary */}
      {summary && (
        <div className="mb-4 p-4 bg-gray-800 border border-gray-700 rounded-lg">
          <h2 className="text-xl font-bold mb-3 text-yellow-400">🏁 Race Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-gray-400 text-sm">Winner</p>
              <p className="text-2xl font-bold text-yellow-400">{summary.winner}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Fastest Lap</p>
              <p className="text-2xl font-bold">{summary.fastest_lap}s</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Avg Tyre Wear</p>
              <p className="text-2xl font-bold">{summary.avg_tyre_wear}%</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Laps</p>
              <p className="text-2xl font-bold">{timeline.length > 0 ? Math.max(...timeline.map(e => e.lap)) : 0}</p>
            </div>
          </div>
        </div>
      )}

      {/* Playback Controls */}
      {timeline.length > 0 && (
        <div className="mb-4 flex justify-center gap-3">
          <button
            onClick={isPlaying ? pause : play}
            className={`px-6 py-3 rounded-lg font-bold text-lg transition-colors ${
              isPlaying
                ? "bg-red-600 hover:bg-red-700"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {isPlaying ? "⏸ Pause" : "▶ Play"}
          </button>
          <button
            onClick={reset}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold text-lg transition-colors"
          >
            🔄 Reset
          </button>
          <div className="px-6 py-3 bg-gray-800 rounded-lg">
            <span className="text-gray-400">Lap: </span>
            <span className="font-bold text-xl">{currentLap}</span>
          </div>
        </div>
      )}

      {/* Main Grid */}
      {timeline.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Track View */}
          <div className="lg:col-span-2 bg-gray-800 rounded-lg p-4 border border-gray-700">
            <h2 className="text-xl font-bold mb-3 text-yellow-400">📍 Track View</h2>
            <TrackView agents={agents} trackLength={1000} currentLap={currentLap} />
          </div>

          {/* Leaderboard */}
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <h2 className="text-xl font-bold mb-3 text-yellow-400">🏆 Leaderboard</h2>
            <Leaderboard agents={agents} />
          </div>

          {/* Charts */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <LapChart agents={chartData.agents} />
            </div>
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <TyreChart agents={chartData.agents} />
            </div>
          </div>

          {/* Event Log */}
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <h2 className="text-xl font-bold mb-3 text-yellow-400">📋 Event Log</h2>
            <EventLog events={events} />
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-800 rounded-lg border border-gray-700">
          <p className="text-2xl text-gray-400 mb-4">🚗 Ready to Race!</p>
          <p className="text-gray-500">Configure your race above and click "Start Simulation"</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
