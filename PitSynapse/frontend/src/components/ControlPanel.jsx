// ControlPanel.jsx
import { useState } from "react";

export default function ControlPanel({ onStart }) {
  const [totalLaps, setTotalLaps] = useState(50);
  const [weather, setWeather] = useState("dry");
  const [numAgents, setNumAgents] = useState(3);

  const handleStart = () => {
    // Generate default agents
    const agents = [];
    const agentTypes = [
      { name: "Aggressive Racer", aggression: 0.9, risk_taking: 0.85, tyre_management: 0.4, pit_bias: 0.3 },
      { name: "Tyre Whisperer", aggression: 0.4, risk_taking: 0.35, tyre_management: 0.95, pit_bias: 0.4 },
      { name: "Balanced Racer", aggression: 0.55, risk_taking: 0.5, tyre_management: 0.65, pit_bias: 0.5 },
      { name: "Strategist", aggression: 0.5, risk_taking: 0.4, tyre_management: 0.7, pit_bias: 0.8 },
      { name: "Risk Taker", aggression: 0.85, risk_taking: 0.9, tyre_management: 0.3, pit_bias: 0.2 }
    ];
    
    for (let i = 0; i < numAgents; i++) {
      const agentType = agentTypes[i % agentTypes.length];
      agents.push({
        id: `agent_${i + 1}`,
        name: `${agentType.name} ${i > 4 ? i + 1 : ''}`,
        ...agentType
      });
    }

    onStart({
      totalLaps,
      weather,
      agents
    });
  };

  return (
    <div className="bg-gray-800 text-white p-6 rounded-lg shadow-xl border border-gray-700 space-y-5 w-full max-w-2xl">
      <h2 className="text-2xl font-bold mb-4 text-center text-yellow-400">🎮 Simulation Controls</h2>

      {/* Total Laps Slider */}
      <div>
        <label className="block mb-2 font-semibold text-lg">
          Total Laps: <span className="text-yellow-400">{totalLaps}</span>
        </label>
        <input
          type="range"
          min={1}
          max={100}
          step={1}
          value={totalLaps}
          onChange={(e) => setTotalLaps(Number(e.target.value))}
          className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>1</span>
          <span>50</span>
          <span>100</span>
        </div>
      </div>

      {/* Weather Selection */}
      <div>
        <label className="block mb-2 font-semibold text-lg">Weather:</label>
        <select
          value={weather}
          onChange={(e) => setWeather(e.target.value)}
          className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-yellow-500 focus:outline-none text-lg"
        >
          <option value="dry">☀️ Dry</option>
          <option value="rain">🌧️ Rain</option>
          <option value="mixed">🌦️ Mixed</option>
        </select>
      </div>

      {/* Number of Agents */}
      <div>
        <label className="block mb-2 font-semibold text-lg">
          Number of Agents: <span className="text-yellow-400">{numAgents}</span>
        </label>
        <input
          type="range"
          min={2}
          max={5}
          step={1}
          value={numAgents}
          onChange={(e) => setNumAgents(Number(e.target.value))}
          className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>2</span>
          <span>3</span>
          <span>4</span>
          <span>5</span>
        </div>
      </div>

      {/* Start Simulation Button */}
      <button
        onClick={handleStart}
        className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-gray-900 font-bold py-4 px-6 rounded-lg transition-all transform hover:scale-105 text-xl shadow-lg"
      >
        🚀 Start Simulation
      </button>
    </div>
  );
}
