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
    <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 text-white p-8 rounded-2xl shadow-2xl border-2 border-yellow-500/30 backdrop-blur-sm w-full max-w-3xl card-hover">
      <h2 className="text-3xl font-black mb-6 text-center gradient-text flex items-center justify-center gap-3">
        <span className="text-4xl">🎮</span>
        Simulation Controls
      </h2>

      <div className="space-y-6">
        {/* Total Laps Slider */}
        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50">
          <label className="block mb-3 font-bold text-lg flex items-center justify-between">
            <span>Total Laps</span>
            <span className="text-yellow-400 text-2xl font-black">{totalLaps}</span>
          </label>
          <input
            type="range"
            min={1}
            max={100}
            step={1}
            value={totalLaps}
            onChange={(e) => setTotalLaps(Number(e.target.value))}
            className="w-full h-4 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-yellow-500 slider"
            style={{
              background: `linear-gradient(to right, #fbbf24 0%, #fbbf24 ${(totalLaps/100)*100}%, #475569 ${(totalLaps/100)*100}%, #475569 100%)`
            }}
          />
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>1</span>
            <span>50</span>
            <span>100</span>
          </div>
        </div>

        {/* Weather Selection */}
        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50">
          <label className="block mb-3 font-bold text-lg">Weather Conditions</label>
          <select
            value={weather}
            onChange={(e) => setWeather(e.target.value)}
            className="w-full p-4 rounded-xl bg-slate-700 text-white border-2 border-slate-600 focus:border-yellow-500 focus:outline-none text-lg font-semibold transition-all"
          >
            <option value="dry">☀️ Dry</option>
            <option value="rain">🌧️ Rain</option>
            <option value="mixed">🌦️ Mixed</option>
          </select>
        </div>

        {/* Number of Agents */}
        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50">
          <label className="block mb-3 font-bold text-lg flex items-center justify-between">
            <span>Number of Agents</span>
            <span className="text-blue-400 text-2xl font-black">{numAgents}</span>
          </label>
          <input
            type="range"
            min={2}
            max={5}
            step={1}
            value={numAgents}
            onChange={(e) => setNumAgents(Number(e.target.value))}
            className="w-full h-4 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            style={{
              background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((numAgents-2)/(5-2))*100}%, #475569 ${((numAgents-2)/(5-2))*100}%, #475569 100%)`
            }}
          />
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5</span>
          </div>
        </div>

        {/* Start Simulation Button */}
        <button
          onClick={handleStart}
          className="w-full bg-gradient-to-r from-yellow-500 via-yellow-400 to-orange-500 hover:from-yellow-600 hover:via-yellow-500 hover:to-orange-600 text-gray-900 font-black py-5 px-8 rounded-xl transition-all transform hover:scale-105 text-2xl shadow-2xl hover:shadow-yellow-500/50 border-2 border-yellow-300/50"
        >
          🚀 Start Simulation
        </button>
      </div>
    </div>
  );
}
