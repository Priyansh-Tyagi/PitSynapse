import React, { useRef, useEffect } from "react";

const TrackView = ({ agents = [], trackLength = 1000, currentLap = 1 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, W, H);

    // Draw track background
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(0, 0, W, H);

    // Draw track line
    ctx.strokeStyle = "#444";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, H / 2);
    ctx.lineTo(W, H / 2);
    ctx.stroke();

    // Draw finish line
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(W - 20, 0);
    ctx.lineTo(W - 20, H);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw each agent
    const colors = ["#60a5fa", "#f472b6", "#34d399", "#fbbf24", "#a78bfa"];
    
    agents.forEach((agent, i) => {
      // Calculate position on track (0-1 based on position in race)
      const positionRatio = agent.position ? (agents.length - agent.position + 1) / agents.length : 0.5;
      const x = positionRatio * (W - 40) + 20;
      const y = H / 2;

      // Agent circle
      ctx.beginPath();
      ctx.fillStyle = colors[i % colors.length];
      ctx.arc(x, y, 12, 0, Math.PI * 2);
      ctx.fill();
      
      // Border
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Name label
      ctx.fillStyle = "#fff";
      ctx.font = "11px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(agent.name || agent.id, x, y - 18);

      // Position number
      ctx.fillStyle = "#000";
      ctx.font = "bold 10px sans-serif";
      ctx.fillText(agent.position || i + 1, x, y + 4);
    });

    // Current Lap text
    ctx.fillStyle = "#fff";
    ctx.font = "14px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`Lap: ${currentLap}`, 10, 20);
  }, [agents, trackLength, currentLap]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={200}
      style={{
        width: "100%",
        height: "200px",
        background: "#111",
        borderRadius: "8px",
      }}
    />
  );
};

export default TrackView;
