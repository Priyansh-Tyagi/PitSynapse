// EventLog.jsx
import { useEffect, useRef } from "react";

export default function EventLog({ events = [] }) {
  const logEndRef = useRef(null);

  // Scroll to bottom on new event
  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [events]);

  // Get last 20 events
  const recentEvents = events.slice(-20).reverse();

  // Render event description
  const renderEventText = (event) => {
    if (!event || !event.event_type) return "Unknown event";
    
    switch (event.event_type) {
      case "pit_stop":
        return `🛠 ${event.agent_name} entered pit (${event.pit_reason || "strategy"})`;
      case "overtake":
        return `🏎 ${event.agent_name} overtook ${event.overtaken_agent_name} ${
          event.overtake_success ? "✅" : "❌"
        }`;
      case "prl_update":
        return `🧠 ${event.agent_name} adapted (reward: ${event.prl_reward?.toFixed(2) || 0})`;
      case "lap_complete":
        return `🏁 ${event.agent_name} completed lap in ${event.lap_time || "N/A"}s (P${event.position || "?"})`;
      case "weather_change":
        return `🌧 Weather changed to ${event.weather}`;
      default:
        return `${event.agent_name || "Agent"} - ${event.event_type}`;
    }
  };

  if (recentEvents.length === 0) {
    return (
      <div className="bg-gray-900 text-gray-100 p-4 rounded-lg shadow-lg h-64 overflow-y-auto font-mono">
        <h3 className="text-lg font-bold mb-2">Event Log</h3>
        <p className="text-gray-400 text-center py-8">No events yet</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg shadow-lg h-64 overflow-y-auto font-mono">
      <h3 className="text-lg font-bold mb-2">Event Log</h3>
      <ul className="space-y-1">
        {recentEvents.map((e, idx) => (
          <li
            key={idx}
            className="px-2 py-1 rounded hover:bg-gray-800 transition-colors text-sm"
          >
            {renderEventText(e)}
          </li>
        ))}
        <div ref={logEndRef}></div>
      </ul>
    </div>
  );
}
