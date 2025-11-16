// useSimulationPlayer.js
import { useState, useEffect, useRef, useCallback, useMemo } from "react";

/**
 * Hook to play simulation timeline data.
 * Transforms backend timeline format into frontend-friendly agent state.
 */
export default function useSimulationPlayer({ timeline, events }) {
  const TICK_MS = 200; // Speed of simulation player (ms per frame)
  const [currentLap, setCurrentLap] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [agents, setAgents] = useState([]);
  
  const intervalRef = useRef(null);
  const lapIndexRef = useRef(0);

  // Transform timeline into per-lap agent states
  const lapData = useMemo(() => {
    if (!timeline || timeline.length === 0) return [];
    
    const lapMap = new Map();
    
    // Group timeline entries by lap
    timeline.forEach(entry => {
      const lap = entry.lap;
      if (!lapMap.has(lap)) {
        lapMap.set(lap, []);
      }
      lapMap.get(lap).push(entry);
    });
    
    // Convert to array of lap states
    return Array.from(lapMap.entries())
      .map(([lapNum, entries]) => {
        // Sort by position
        const sorted = [...entries].sort((a, b) => a.position - b.position);
        
        // Create agent objects
        const agents = sorted.map((entry, idx) => ({
          id: entry.agent_id,
          name: entry.agent_id,
          position: entry.position,
          lapTime: entry.lap_time,
          tyreWear: entry.tyre_wear,
          action: entry.action,
          lap: lapNum,
          totalLaps: Math.max(...timeline.map(e => e.lap))
        }));
        
        return {
          lap: lapNum,
          agents: agents
        };
      })
      .sort((a, b) => a.lap - b.lap);
  }, [timeline]);

  // Initialize
  useEffect(() => {
    if (lapData.length > 0) {
      setCurrentLap(lapData[0].lap);
      setAgents(lapData[0].agents);
      lapIndexRef.current = 0;
    }
  }, [lapData]);

  // Play loop
  const play = useCallback(() => {
    if (isPlaying || lapData.length === 0) return;
    
    setIsPlaying(true);
    
    intervalRef.current = setInterval(() => {
      lapIndexRef.current += 1;
      
      if (lapIndexRef.current >= lapData.length) {
        // End of simulation
        pause();
        return;
      }
      
      const lapState = lapData[lapIndexRef.current];
      setCurrentLap(lapState.lap);
      setAgents(lapState.agents);
    }, TICK_MS);
  }, [isPlaying, lapData]);

  const pause = useCallback(() => {
    setIsPlaying(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    pause();
    lapIndexRef.current = 0;
    if (lapData.length > 0) {
      setCurrentLap(lapData[0].lap);
      setAgents(lapData[0].agents);
    }
  }, [pause, lapData]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    agents,
    currentLap,
    isPlaying,
    play,
    pause,
    reset,
  };
}
