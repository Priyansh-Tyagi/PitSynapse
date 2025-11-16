import React, { useState, useEffect, useRef } from "react";
import Leaderboard from "./components/Leaderboard";
import TrackView from "./components/TrackView";
import { startSimulation } from "./services/api";

const sampleAgents = [
  { id: "A1", x: 0.05, y: 0.5, color: "#60a5fa" },
  { id: "B2", x: 0.35, y: 0.45, color: "#f472b6" },
  { id: "C3", x: 0.65, y: 0.55, color: "#34d399" },
];

function App() {
  const [agents, setAgents] = useState(sampleAgents);
  const [animating, setAnimating] = useState(false);
  const rafRef = useRef(null);

  // Simple animation loop that advances agents along the X axis
  useEffect(() => {
    if (!animating) {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      return;
    }

    const step = () => {
      setAgents(prev => prev.map(a => ({ ...a, x: (a.x + 0.002) % 1 })));
      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [animating]);

  const runRace = async () => {
    try {
      const data = await startSimulation({
        laps: 5,
        agents: [
          { name: "Aggressor", aggression: 0.9, tyre_management: 0.4, risk_taking: 0.85, pit_bias: 0.3 },
          { name: "Conserver", aggression: 0.3, tyre_management: 0.9, risk_taking: 0.25, pit_bias: 0.7 }
        ]
      });
      // Best-effort mapping from API response to TrackView shape
      if (data && data.timeline && data.timeline.length) {
        const last = data.timeline[data.timeline.length - 1];
        // If API returns agent positions, map them; otherwise keep sample positions
        const mapped = (last.agents || []).map((ag, i) => ({
          id: ag.id || ag.name || `P${i+1}`,
          x: (i / Math.max(1, (last.agents || []).length)) * 0.9 + 0.05,
          y: 0.5,
          color: sampleAgents[i % sampleAgents.length].color,
        }));
        setAgents(mapped.length ? mapped : sampleAgents);
      }
    } catch (err) {
      // keep sample agents on error
      console.error("Simulation failed:", err);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex gap-2">
        <button onClick={runRace} className="px-4 py-2 bg-blue-500 text-white rounded">
          Start Race (API)
        </button>
        <button
          onClick={() => setAnimating(a => !a)}
          className={`px-4 py-2 rounded ${animating ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}
        >
          {animating ? 'Stop Animation' : 'Animate'}
        </button>
      </div>

      <TrackView agents={agents} width={760} height={220} />

      <Leaderboard agents={agents} />
    </div>
  );
}

export default App;
