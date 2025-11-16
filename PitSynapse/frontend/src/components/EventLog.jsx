// EventLog.jsx
import { useEffect, useRef, useState } from "react";

export default function EventLog({ events = [] }) {
  const logEndRef = useRef(null);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [filter, setFilter] = useState("all");

  // Filter events
  useEffect(() => {
    if (!events || events.length === 0) {
      setFilteredEvents([]);
      return;
    }

    let filtered = events;
    if (filter !== "all") {
      filtered = events.filter(e => e.event_type === filter);
    }

    // Get last 30 events
    setFilteredEvents(filtered.slice(-30).reverse());
  }, [events, filter]);

  // Scroll to bottom on new event
  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [filteredEvents]);

  // Render event description with enhanced styling
  const renderEventText = (event) => {
    if (!event || !event.event_type) return "Unknown event";
    
    const timestamp = event.timestamp ? `[${event.timestamp.toFixed(1)}s]` : "";
    
    switch (event.event_type) {
      case "pit_stop":
        return (
          <div className="flex items-center gap-3">
            <span className="text-2xl animate-pulse">🛠️</span>
            <div className="flex-1">
              <span className="font-black text-orange-300 text-lg">{event.agent_name || event.agent_id}</span>
              <span className="text-gray-300 ml-2">entered pit</span>
              <span className="text-gray-500 text-sm ml-2 bg-slate-800/50 px-2 py-1 rounded">({event.pit_reason || "strategy"})</span>
            </div>
            <span className="text-xs text-gray-500 font-mono">{timestamp}</span>
          </div>
        );
      case "overtake":
        return (
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏎️</span>
            <div className="flex-1">
              <span className="font-black text-green-300 text-lg">{event.agent_name || event.agent_id}</span>
              <span className="text-gray-300 ml-2">overtook</span>
              <span className="font-black text-red-300 text-lg ml-2">{event.overtaken_agent_name || "opponent"}</span>
              <span className="ml-2 text-xl">{event.overtake_success ? "✅" : "❌"}</span>
            </div>
            <span className="text-xs text-gray-500 font-mono">{timestamp}</span>
          </div>
        );
      case "prl_update":
        return (
          <div className="flex items-center gap-3">
            <span className="text-2xl">🧠</span>
            <div className="flex-1">
              <span className="font-black text-blue-300 text-lg">{event.agent_name || event.agent_id}</span>
              <span className="text-gray-300 ml-2">adapted strategy</span>
              <span className="text-blue-400 text-sm ml-2 bg-blue-900/30 px-2 py-1 rounded font-bold">
                reward: {event.prl_reward?.toFixed(2) || 0}
              </span>
            </div>
            <span className="text-xs text-gray-500 font-mono">{timestamp}</span>
          </div>
        );
      case "lap_complete":
        return (
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏁</span>
            <div className="flex-1">
              <span className="font-black text-yellow-300 text-lg">{event.agent_name || event.agent_id}</span>
              <span className="text-gray-300 ml-2">completed lap in</span>
              <span className="font-black text-white text-lg ml-2 bg-yellow-900/30 px-2 py-1 rounded">{event.lap_time || "N/A"}s</span>
              <span className="text-gray-400 text-sm ml-2 bg-slate-800/50 px-2 py-1 rounded">P{event.position || "?"}</span>
            </div>
            <span className="text-xs text-gray-500 font-mono">{timestamp}</span>
          </div>
        );
      case "weather_change":
        return (
          <div className="flex items-center gap-3">
            <span className="text-2xl">🌧️</span>
            <div className="flex-1">
              <span className="text-gray-300">Weather changed to</span>
              <span className="font-black text-cyan-300 text-lg ml-2 bg-cyan-900/30 px-2 py-1 rounded">{event.weather}</span>
            </div>
            <span className="text-xs text-gray-500 font-mono">{timestamp}</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-3">
            <span className="text-gray-400">{event.agent_name || "Agent"}</span>
            <span className="text-gray-500">- {event.event_type}</span>
            <span className="text-xs text-gray-500 font-mono ml-auto">{timestamp}</span>
          </div>
        );
    }
  };

  if (filteredEvents.length === 0) {
    return (
      <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 text-gray-100 p-6 rounded-2xl shadow-2xl h-96 overflow-y-auto font-mono border-2 border-slate-700/50 backdrop-blur-sm">
        <div className="flex justify-between items-center mb-4 sticky top-0 bg-slate-900/90 pb-3 border-b-2 border-slate-700/50 backdrop-blur-sm z-10">
          <h3 className="text-xl font-black text-yellow-400 flex items-center gap-2">
            <span className="text-2xl">📋</span>
            Event Log
          </h3>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 rounded-xl bg-slate-800 text-white border-2 border-slate-600 focus:border-yellow-500 focus:outline-none text-sm font-semibold transition-all"
          >
            <option value="all">All Events</option>
            <option value="lap_complete">Lap Complete</option>
            <option value="pit_stop">Pit Stops</option>
            <option value="overtake">Overtakes</option>
            <option value="prl_update">PRL Updates</option>
            <option value="weather_change">Weather</option>
          </select>
        </div>
        <div className="text-center py-16">
          <div className="text-7xl mb-4 animate-bounce">📋</div>
          <p className="text-gray-400 text-lg">No events yet</p>
          <p className="text-gray-500 text-sm mt-2">Events will appear here during the race</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 text-gray-100 p-6 rounded-2xl shadow-2xl h-96 overflow-y-auto font-mono border-2 border-slate-700/50 backdrop-blur-sm">
      <div className="flex justify-between items-center mb-4 sticky top-0 bg-slate-900/90 pb-3 border-b-2 border-slate-700/50 backdrop-blur-sm z-10">
        <h3 className="text-xl font-black text-yellow-400 flex items-center gap-2">
          <span className="text-2xl">📋</span>
          Event Log
          <span className="ml-2 text-sm font-normal text-gray-400 bg-slate-800 px-3 py-1 rounded-full">
            {filteredEvents.length} events
          </span>
        </h3>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 rounded-xl bg-slate-800 text-white border-2 border-slate-600 focus:border-yellow-500 focus:outline-none text-sm font-semibold transition-all"
        >
          <option value="all">All Events</option>
          <option value="lap_complete">Lap Complete</option>
          <option value="pit_stop">Pit Stops</option>
          <option value="overtake">Overtakes</option>
          <option value="prl_update">PRL Updates</option>
          <option value="weather_change">Weather</option>
        </select>
      </div>
      <ul className="space-y-3">
        {filteredEvents.map((e, idx) => {
          const borderColor = 
            e.event_type === "pit_stop" ? "border-orange-500/50" :
            e.event_type === "overtake" ? "border-green-500/50" :
            e.event_type === "prl_update" ? "border-blue-500/50" :
            e.event_type === "lap_complete" ? "border-yellow-500/50" :
            e.event_type === "weather_change" ? "border-cyan-500/50" :
            "border-slate-700/50";
          
          return (
            <li
              key={idx}
              className={`px-5 py-4 rounded-xl hover:bg-slate-800/70 transition-all border-l-4 ${borderColor} bg-slate-800/30 backdrop-blur-sm transform hover:scale-[1.02] hover:shadow-lg`}
            >
              {renderEventText(e)}
            </li>
          );
        })}
        <div ref={logEndRef}></div>
      </ul>
    </div>
  );
}
