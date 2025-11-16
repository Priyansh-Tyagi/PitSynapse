// useSimulationPlayer.js
import { useState, useEffect, useRef, useCallback } from "react";

/*
Expected timeline format (from backend):

[
  {
    lap: 1,
    agents: [
      {
        name: "VER",
        position: 120.3,      // meters on track
        lapProgress: 0.25,    // 0 → 1
        tyre: 94,             // %
        isPitting: false,
        delta: 0.4,
      },
      ...
    ]
  },
  ...
]

*/

export default function useSimulationPlayer(timeline) {
  const TICK_MS = 120; // speed of the simulation player
  const [frameIndex, setFrameIndex] = useState(0);
  const [agents, setAgents] = useState([]);
  const [currentLap, setCurrentLap] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);

  const intervalRef = useRef(null);
  const framesRef = useRef([]);

  // --------------------------------------------
  // STEP 1 — Convert Timeline → Frames
  // --------------------------------------------
  useEffect(() => {
    if (!timeline || timeline.length === 0) return;

    // Store deep-copied frames
    framesRef.current = timeline.map((frame) => ({
      lap: frame.lap,
      agents: frame.agents.map((a) => ({ ...a })),
    }));

    // Reset playback
    setFrameIndex(0);
    setCurrentLap(timeline[0]?.lap || 1);
    setAgents(timeline[0]?.agents || []);
    setIsPlaying(false);

    if (intervalRef.current) clearInterval(intervalRef.current);
  }, [timeline]);

  // --------------------------------------------
  // STEP 2 — Apply a single frame update
  // --------------------------------------------
  const applyFrame = useCallback((index) => {
    const frames = framesRef.current;
    if (!frames || frames.length === 0) return;

    const frame = frames[index];
    if (!frame) return;

    // Update state
    setAgents(frame.agents);
    setCurrentLap(frame.lap);
  }, []);

  // --------------------------------------------
  // STEP 3 — Play loop (120ms per frame)
  // --------------------------------------------
  const play = useCallback(() => {
    if (isPlaying) return;

    setIsPlaying(true);

    intervalRef.current = setInterval(() => {
      setFrameIndex((prev) => {
        const frames = framesRef.current;
        if (!frames) return prev;

        const next = prev + 1;

        // END OF SIMULATION
        if (next >= frames.length) {
          clearInterval(intervalRef.current);
          setIsPlaying(false);
          return prev;
        }

        applyFrame(next);
        return next;
      });
    }, TICK_MS);
  }, [isPlaying, applyFrame]);

  const pause = useCallback(() => {
    setIsPlaying(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  const reset = useCallback(() => {
    pause();
    setFrameIndex(0);
    setAgents(framesRef.current[0]?.agents || []);
    setCurrentLap(framesRef.current[0]?.lap || 1);
  }, [pause]);

  // --------------------------------------------
  // Cleanup on unmount
  // --------------------------------------------
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // --------------------------------------------
  // RETURN API
  // --------------------------------------------
  return {
    agents,
    currentLap,
    frameIndex,
    isPlaying,
    play,
    pause,
    reset,
  };
}
