// src/services/api.js
import axios from "axios";

// Base Axios instance (optional: set default base URL)
const apiClient = axios.create({
  baseURL: "http://localhost:8000", // change if your FastAPI backend runs elsewhere
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Simulate Race
 * @param {Object} params - Simulation parameters
 * @param {number} params.totalLaps - Total laps
 * @param {number} params.weatherRandomness - Weather randomness (0-1)
 * @param {string} params.selectedAgent - Agent personality
 * @returns {Promise<{timeline: Array, summary: Object}>}
 */
export const simulateRace = async (params) => {
  try {
    const response = await apiClient.post("/simulate", params);
    return { data: response.data, error: null, isLoading: false };
  } catch (err) {
    console.error("Simulation API error:", err);
    const error = err.response?.data?.detail || err.message || "Unknown error";
    return { data: null, error, isLoading: false };
  }
};

// Convenience wrapper expected by the app: returns the response data or throws on error
export const startSimulation = async (params) => {
  const { data, error } = await simulateRace(params);
  if (error) throw new Error(error);
  return data;
};
