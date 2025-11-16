// src/components/Dashboard.jsx
import React, { useState, useEffect } from "react";
import ControlPanel from "./ControlPanel";
import TrackView from "./TrackView";
import Leaderboard from "./Leaderboard";
import LapChart from "./LapChart";
import TyreChart from "./TyreChart";
import EventLog from "./EventLog";
import { simulateRace } from "../services/api";
import useSimulationPlayer from "../hooks/useSimulationPlayer";

const Dashboard = () => {
  const [params, setParams] = useState({
    totalLaps: 50,
    weatherRandomness: 0.5,
    selectedAgent: "Balanced",
  });
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { agents, currentLap, play, pause, reset } = useSimulationPlayer({
    timeline,
  });

  // Handle "Start Simulation" click
  const runSimulation = async (newParams) => {
    setParams(newParams);
    setLoading(true);
    setError(null);

    const { data, error: apiError } = await simulateRace(newParams);
    setLoading(false);

    if (apiError) {
      setError(apiError);
      return;
    }

    if (data?.timeline) {
      setTimeline(data.timeline);
      reset(); // Reset player to start of timeline
      play();  // Start playback automatically
    }
  };

  return (
    <div className="p-4 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-4 text-center">PitSynapse Dashboard</h1>

      {/* Control Panel */}
      <div className="mb-4">
        <ControlPanel onStart={runSimulation} />
      </div>

      {/* Error & Loading */}
      {loading && <p className="text-yellow-400 mb-2">Simulation running...</p>}
      {error && <p className="text-red-500 mb-2">Error: {error}</p>}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Track View */}
        <div className="lg:col-span-2 bg-gray-800 rounded p-2">
          <TrackView agents={agents} trackLength={1000} currentLap={currentLap} />
        </div>

        {/* Leaderboard */}
        <div className="bg-gray-800 rounded p-2">
          <Leaderboard agents={agents} />
        </div>

        {/* Charts */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-800 rounded p-2">
            <LapChart timeline={timeline} />
          </div>
          <div className="bg-gray-800 rounded p-2">
            <TyreChart timeline={timeline} />
          </div>
        </div>

        {/* Event Log */}
        <div className="bg-gray-800 rounded p-2">
          <EventLog timeline={timeline} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
