// src/services/api.js
import axios from "axios";

// Base Axios instance
const apiClient = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Simulate Race
 * @param {Object} params - Simulation parameters
 * @param {number} params.totalLaps - Total laps
 * @param {string} params.weather - Weather mode ("dry", "rain", "mixed")
 * @param {Array} params.agents - Array of agent settings
 * @returns {Promise<{data: Object, error: string|null}>}
 */
export const simulateRace = async (params) => {
  try {
    // Transform frontend params to backend format
    const requestBody = {
      race: {
        total_laps: params.totalLaps || 50,
        weather: params.weather || "dry",
        track_id: params.trackId || "default"
      },
      agents: params.agents || [
        {
          id: "agent_1",
          name: "Aggressive Racer",
          aggression: 0.9,
          risk_taking: 0.85,
          tyre_management: 0.4,
          pit_bias: 0.3
        },
        {
          id: "agent_2",
          name: "Tyre Whisperer",
          aggression: 0.4,
          risk_taking: 0.35,
          tyre_management: 0.95,
          pit_bias: 0.4
        }
      ]
    };
    
    const response = await apiClient.post("/simulate", requestBody);
    return { data: response.data, error: null, isLoading: false };
  } catch (err) {
    console.error("Simulation API error:", err);
    const error = err.response?.data?.detail || err.message || "Unknown error";
    return { data: null, error, isLoading: false };
  }
};

// Convenience wrapper
export const startSimulation = async (params) => {
  const { data, error } = await simulateRace(params);
  if (error) throw new Error(error);
  return data;
};
