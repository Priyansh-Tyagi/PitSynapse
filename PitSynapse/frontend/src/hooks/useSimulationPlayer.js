// useSimulationPlayer.js
import { useState, useEffect, useRef, useCallback, useMemo } from "react";

/**
 * Enhanced simulation player with smooth animations and real-time updates
 */
export default function useSimulationPlayer({ timeline, events }) {
  const TICK_MS = 150; // Speed of simulation player (ms per frame)
  const [currentLap, setCurrentLap] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [agents, setAgents] = useState([]);
  const [currentTime, setCurrentTime] = useState(0);
  
  const intervalRef = useRef(null);
  const lapIndexRef = useRef(0);
  const timeRef = useRef(0);

  // Transform timeline into per-lap agent states with smooth transitions
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
    
    // Convert to array of lap states with enhanced data
    return Array.from(lapMap.entries())
      .map(([lapNum, entries]) => {
        // Sort by position
        const sorted = [...entries].sort((a, b) => a.position - b.position);
        
        // Create agent objects with enhanced properties
        const agents = sorted.map((entry, idx) => {
          // Calculate speed based on lap time (faster lap = higher speed)
          const baseSpeed = 90; // Base speed in km/h
          const speedVariation = (100 - entry.lap_time) * 0.5; // Adjust based on performance
          const speed = Math.max(70, Math.min(120, baseSpeed + speedVariation + Math.random() * 10));
          
          return {
            id: entry.agent_id,
            name: entry.agent_id,
            position: entry.position,
            lapTime: entry.lap_time,
            tyreWear: entry.tyre_wear,
            action: entry.action,
            lap: lapNum,
            totalLaps: Math.max(...timeline.map(e => e.lap)),
            speed: speed,
            isPitting: entry.action === "pit_stop",
            color: ["#60a5fa", "#f472b6", "#34d399", "#fbbf24", "#a78bfa"][idx % 5]
          };
        });
        
        return {
          lap: lapNum,
          agents: agents,
          timestamp: lapNum * 100 // Simulated timestamp
        };
      })
      .sort((a, b) => a.lap - b.lap);
  }, [timeline]);

  // Calculate position changes
  const agentsWithChanges = useMemo(() => {
    if (lapData.length < 2) return agents;
    
    const currentLapData = lapData[lapIndexRef.current];
    const prevLapData = lapData[Math.max(0, lapIndexRef.current - 1)];
    
    if (!currentLapData || !prevLapData) return agents;
    
    return currentLapData.agents.map(agent => {
      const prevAgent = prevLapData.agents.find(a => a.id === agent.id);
      const positionChange = prevAgent 
        ? prevAgent.position - agent.position 
        : 0;
      
      return {
        ...agent,
        positionChange: positionChange
      };
    });
  }, [agents, lapData]);

  // Initialize
  useEffect(() => {
    if (lapData.length > 0) {
      setCurrentLap(lapData[0].lap);
      setAgents(lapData[0].agents);
      lapIndexRef.current = 0;
      timeRef.current = 0;
      setCurrentTime(0);
    }
  }, [lapData]);

  // Play loop with smooth updates
  const play = useCallback(() => {
    if (isPlaying || lapData.length === 0) return;
    
    setIsPlaying(true);
    
    intervalRef.current = setInterval(() => {
      lapIndexRef.current += 1;
      timeRef.current += TICK_MS;
      setCurrentTime(timeRef.current);
      
      if (lapIndexRef.current >= lapData.length) {
        // End of simulation
        pause();
        return;
      }
      
      const lapState = lapData[lapIndexRef.current];
      setCurrentLap(lapState.lap);
      
      // Smooth transition with position changes
      const agentsWithPositions = lapState.agents.map(agent => {
        const prevAgent = agents.find(a => a.id === agent.id);
        return {
          ...agent,
          positionChange: prevAgent ? prevAgent.position - agent.position : 0
        };
      });
      
      setAgents(agentsWithPositions);
    }, TICK_MS);
  }, [isPlaying, lapData, agents]);

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
    timeRef.current = 0;
    setCurrentTime(0);
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
    agents: agentsWithChanges,
    currentLap,
    currentTime,
    isPlaying,
    play,
    pause,
    reset,
    totalLaps: lapData.length > 0 ? Math.max(...lapData.map(l => l.lap)) : 0
  };
}
