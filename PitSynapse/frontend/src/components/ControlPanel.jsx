// ControlPanel.jsx
import { useState } from "react";

export default function ControlPanel({ runSimulation, agentOptions = [] }) {
  const [totalLaps, setTotalLaps] = useState(50);
  const [weatherRandomness, setWeatherRandomness] = useState(0.5);
  const [selectedAgent, setSelectedAgent] = useState(agentOptions[0] || "");

  const handleStart = () => {
    runSimulation({
      totalLaps,
      weatherRandomness,
      selectedAgent,
    });
  };

  return (
    <div className="bg-gray-900 text-gray-100 p-6 rounded-lg shadow-lg space-y-4 w-full max-w-md">
      <h2 className="text-xl font-bold mb-2">Simulation Controls</h2>

      {/* Total Laps Slider */}
      <div>
        <label className="block mb-1 font-medium">Total Laps: {totalLaps}</label>
        <input
          type="range"
          min={1}
          max={100}
          step={1}
          value={totalLaps}
          onChange={(e) => setTotalLaps(Number(e.target.value))}
          className="w-full accent-yellow-500"
        />
      </div>

      {/* Weather Randomness Slider */}
      <div>
        <label className="block mb-1 font-medium">
          Weather Randomness: {weatherRandomness.toFixed(2)}
        </label>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={weatherRandomness}
          onChange={(e) => setWeatherRandomness(Number(e.target.value))}
          className="w-full accent-blue-500"
        />
      </div>

      {/* Agent Personality Dropdown */}
      <div>
        <label className="block mb-1 font-medium">Agent Personality:</label>
        <select
          value={selectedAgent}
          onChange={(e) => setSelectedAgent(e.target.value)}
          className="w-full p-2 rounded bg-gray-800 text-gray-100 border border-gray-700"
        >
          {agentOptions.map((agent) => (
            <option key={agent} value={agent}>
              {agent}
            </option>
          ))}
        </select>
      </div>

      {/* Start Simulation Button */}
      <button
        onClick={handleStart}
        className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-2 px-4 rounded transition-colors"
      >
        Start Simulation
      </button>
    </div>
  );
}
