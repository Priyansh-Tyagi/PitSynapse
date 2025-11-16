// EventLog.jsx
import { useEffect, useRef } from "react";

export default function EventLog({ events }) {
  const logEndRef = useRef(null);

  // Scroll to bottom on new event
  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [events]);

  // Get last 10 events
  const recentEvents = events.slice(-10).reverse();

  // Render event description
  const renderEventText = (event) => {
    switch (event.event_type) {
      case "pit_stop":
        return `${event.agent_name} entered pit (Reason: ${event.pit_reason || "strategy"})`;
      case "overtake":
        return `${event.agent_name} overtook ${event.overtaken_agent_name} ${
          event.overtake_success ? "✅" : "❌"
        }`;
      case "prl_update":
        return `${event.agent_name} is pushing (PRL reward: ${event.prl_reward.toFixed(
          2
        )})`;
      case "lap_complete":
        return `${event.agent_name} completed lap ${event.lap_number || ""} in ${
          event.lap_time || "N/A"
        }s`;
      case "incident":
        return `${event.agent_name} had an incident (${event.incident_type})`;
      case "weather_change":
        return `Weather changed to ${event.weather}`;
      default:
        return `${event.agent_name || "Agent"} did something`;
    }
  };

  return (
    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg shadow-lg h-64 overflow-y-auto font-mono">
      <h3 className="text-lg font-bold mb-2">Event Log</h3>
      <ul className="space-y-1">
        {recentEvents.map((e, idx) => (
          <li
            key={idx}
            className="px-2 py-1 rounded hover:bg-gray-800 transition-colors"
          >
            {renderEventText(e)}
          </li>
        ))}
        <div ref={logEndRef}></div>
      </ul>
    </div>
  );
}
