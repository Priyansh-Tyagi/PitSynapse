import React, { useRef, useEffect, useState } from "react";

const TrackView = ({ agents = [], trackLength = 1000, currentLap = 1 }) => {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const [carPositions, setCarPositions] = useState({});

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;

    // Initialize car positions with smooth animation
    const updateCarPositions = () => {
      setCarPositions(prev => {
        const newPositions = {};
        agents.forEach((agent, i) => {
          const agentId = agent.id || i;
          const positionRatio = agent.position 
            ? (agents.length - agent.position + 1) / agents.length 
            : 0.5;
          
          const targetX = positionRatio * (W - 80) + 40;
          const prevX = prev[agentId]?.x || targetX;
          
          // Smooth interpolation
          newPositions[agentId] = {
            x: prevX + (targetX - prevX) * 0.1,
            y: H / 2,
            color: agent.color || ["#60a5fa", "#f472b6", "#34d399", "#fbbf24", "#a78bfa"][i % 5],
            name: agent.name || agent.id,
            position: agent.position || i + 1,
            speed: agent.speed || 0,
            isPitting: agent.isPitting || false
          };
        });
        return newPositions;
      });
    };

    const draw = () => {
      // Clear canvas
      ctx.clearRect(0, 0, W, H);

      // Draw track background with gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, H);
      gradient.addColorStop(0, "#0a0a0a");
      gradient.addColorStop(1, "#1a1a1a");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, W, H);

      // Draw track surface
      ctx.fillStyle = "#2a2a2a";
      ctx.fillRect(0, H / 2 - 30, W, 60);

      // Draw track lines
      ctx.strokeStyle = "#444";
      ctx.lineWidth = 2;
      ctx.setLineDash([20, 20]);
      ctx.beginPath();
      ctx.moveTo(0, H / 2);
      ctx.lineTo(W, H / 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw track edges
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, H / 2 - 30);
      ctx.lineTo(W, H / 2 - 30);
      ctx.moveTo(0, H / 2 + 30);
      ctx.lineTo(W, H / 2 + 30);
      ctx.stroke();

      // Draw finish line
      ctx.strokeStyle = "#ffff00";
      ctx.lineWidth = 4;
      ctx.setLineDash([10, 10]);
      ctx.beginPath();
      ctx.moveTo(W - 30, 0);
      ctx.lineTo(W - 30, H);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw start/finish text
      ctx.fillStyle = "#ffff00";
      ctx.font = "bold 12px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("START/FINISH", W - 30, H / 2 - 40);

      // Draw cars with smooth animation
      Object.values(carPositions).forEach((car, index) => {
        const { x, y, color, name, position, speed, isPitting } = car;

        // Car shadow
        ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
        ctx.beginPath();
        ctx.ellipse(x, y + 8, 15, 5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Car body
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, 14, 0, Math.PI * 2);
        ctx.fill();

        // Car border
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Position number on car
        ctx.fillStyle = "#000";
        ctx.font = "bold 12px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(position, x, y + 4);

        // Driver name above car
        ctx.fillStyle = "#fff";
        ctx.font = "bold 11px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(name, x, y - 20);

        // Speed indicator
        if (speed > 0) {
          ctx.fillStyle = "#00ff00";
          ctx.font = "10px sans-serif";
          ctx.fillText(`${speed.toFixed(0)}km/h`, x, y - 35);
        }

        // Pit stop indicator
        if (isPitting) {
          ctx.fillStyle = "#ffaa00";
          ctx.font = "bold 14px sans-serif";
          ctx.fillText("PIT", x, y + 25);
        }
      });

      // Draw lap counter
      ctx.fillStyle = "#fff";
      ctx.font = "bold 16px sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(`Lap: ${currentLap}`, 15, 25);

      // Draw track info
      ctx.fillStyle = "#888";
      ctx.font = "12px sans-serif";
      ctx.fillText(`${agents.length} Agents Racing`, 15, H - 15);
    };

    // Animation loop
    const animate = () => {
      updateCarPositions();
      draw();
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [agents, trackLength, currentLap]);

  return (
    <canvas
      ref={canvasRef}
      width={1000}
      height={300}
      style={{
        width: "100%",
        height: "300px",
        background: "#0a0a0a",
        borderRadius: "12px",
        border: "2px solid #333",
      }}
    />
  );
};

export default TrackView;
