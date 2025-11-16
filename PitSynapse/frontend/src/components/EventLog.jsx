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
          <div className="flex items-center gap-2">
            <span className="text-orange-400 text-lg">🛠️</span>
            <div>
              <span className="font-bold text-orange-300">{event.agent_name}</span>
              <span className="text-gray-400"> entered pit</span>
              <span className="text-gray-500 text-xs ml-2">({event.pit_reason || "strategy"})</span>
            </div>
          </div>
        );
      case "overtake":
        return (
          <div className="flex items-center gap-2">
            <span className="text-green-400 text-lg">🏎️</span>
            <div>
              <span className="font-bold text-green-300">{event.agent_name}</span>
              <span className="text-gray-400"> overtook </span>
              <span className="font-bold text-red-300">{event.overtaken_agent_name}</span>
              <span className="ml-2">{event.overtake_success ? "✅" : "❌"}</span>
            </div>
          </div>
        );
      case "prl_update":
        return (
          <div className="flex items-center gap-2">
            <span className="text-blue-400 text-lg">🧠</span>
            <div>
              <span className="font-bold text-blue-300">{event.agent_name}</span>
              <span className="text-gray-400"> adapted</span>
              <span className="text-gray-500 text-xs ml-2">
                (reward: {event.prl_reward?.toFixed(2) || 0})
              </span>
            </div>
          </div>
        );
      case "lap_complete":
        return (
          <div className="flex items-center gap-2">
            <span className="text-yellow-400 text-lg">🏁</span>
            <div>
              <span className="font-bold text-yellow-300">{event.agent_name}</span>
              <span className="text-gray-400"> completed lap in </span>
              <span className="font-bold text-white">{event.lap_time || "N/A"}s</span>
              <span className="text-gray-500 text-xs ml-2">(P{event.position || "?"})</span>
            </div>
          </div>
        );
      case "weather_change":
        return (
          <div className="flex items-center gap-2">
            <span className="text-cyan-400 text-lg">🌧️</span>
            <div>
              <span className="text-gray-400">Weather changed to </span>
              <span className="font-bold text-cyan-300">{event.weather}</span>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-2">
            <span className="text-gray-400">{event.agent_name || "Agent"}</span>
            <span className="text-gray-500">- {event.event_type}</span>
          </div>
        );
    }
  };

  if (filteredEvents.length === 0) {
    return (
      <div className="bg-gray-900 text-gray-100 p-6 rounded-lg shadow-lg h-96 overflow-y-auto font-mono border-2 border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-yellow-400">Event Log</h3>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-1 rounded bg-gray-800 text-white border border-gray-600 text-sm"
          >
            <option value="all">All Events</option>
            <option value="lap_complete">Lap Complete</option>
            <option value="pit_stop">Pit Stops</option>
            <option value="overtake">Overtakes</option>
            <option value="prl_update">PRL Updates</option>
            <option value="weather_change">Weather</option>
          </select>
        </div>
        <div className="text-center py-12">
          <div className="text-4xl mb-4">📋</div>
          <p className="text-gray-400">No events yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-gray-100 p-6 rounded-lg shadow-lg h-96 overflow-y-auto font-mono border-2 border-gray-700">
      <div className="flex justify-between items-center mb-4 sticky top-0 bg-gray-900 pb-2 border-b border-gray-700">
        <h3 className="text-lg font-bold text-yellow-400">Event Log</h3>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-1 rounded bg-gray-800 text-white border border-gray-600 text-sm"
        >
          <option value="all">All Events</option>
          <option value="lap_complete">Lap Complete</option>
          <option value="pit_stop">Pit Stops</option>
          <option value="overtake">Overtakes</option>
          <option value="prl_update">PRL Updates</option>
          <option value="weather_change">Weather</option>
        </select>
      </div>
      <ul className="space-y-2">
        {filteredEvents.map((e, idx) => (
          <li
            key={idx}
            className="px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors border-l-4 border-gray-700 bg-gray-850"
          >
            {renderEventText(e)}
          </li>
        ))}
        <div ref={logEndRef}></div>
      </ul>
    </div>
  );
}
