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
          
          const targetX = positionRatio * (W - 100) + 50;
          const prevX = prev[agentId]?.x || targetX;
          
          // Smooth interpolation
          newPositions[agentId] = {
            x: prevX + (targetX - prevX) * 0.15,
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
      const bgGradient = ctx.createLinearGradient(0, 0, 0, H);
      bgGradient.addColorStop(0, "#0a0a0a");
      bgGradient.addColorStop(0.5, "#1a1a1a");
      bgGradient.addColorStop(1, "#0a0a0a");
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, W, H);

      // Draw track surface with texture
      const trackGradient = ctx.createLinearGradient(0, H / 2 - 40, 0, H / 2 + 40);
      trackGradient.addColorStop(0, "#2a2a2a");
      trackGradient.addColorStop(0.5, "#3a3a3a");
      trackGradient.addColorStop(1, "#2a2a2a");
      ctx.fillStyle = trackGradient;
      ctx.fillRect(0, H / 2 - 40, W, 80);

      // Draw track lines with animation
      ctx.strokeStyle = "#444";
      ctx.lineWidth = 3;
      ctx.setLineDash([30, 20]);
      ctx.beginPath();
      ctx.moveTo(0, H / 2);
      ctx.lineTo(W, H / 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw track edges with glow
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 4;
      ctx.shadowBlur = 10;
      ctx.shadowColor = "#fff";
      ctx.beginPath();
      ctx.moveTo(0, H / 2 - 40);
      ctx.lineTo(W, H / 2 - 40);
      ctx.moveTo(0, H / 2 + 40);
      ctx.lineTo(W, H / 2 + 40);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Draw finish line with animation
      ctx.strokeStyle = "#ffff00";
      ctx.lineWidth = 6;
      ctx.setLineDash([15, 10]);
      ctx.shadowBlur = 15;
      ctx.shadowColor = "#ffff00";
      ctx.beginPath();
      ctx.moveTo(W - 40, 0);
      ctx.lineTo(W - 40, H);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.shadowBlur = 0;

      // Draw start/finish text with glow
      ctx.fillStyle = "#ffff00";
      ctx.font = "bold 14px sans-serif";
      ctx.textAlign = "center";
      ctx.shadowBlur = 10;
      ctx.shadowColor = "#ffff00";
      ctx.fillText("START/FINISH", W - 40, H / 2 - 50);
      ctx.shadowBlur = 0;

      // Draw cars with enhanced visuals
      Object.values(carPositions).forEach((car, index) => {
        const { x, y, color, name, position, speed, isPitting } = car;

        // Car shadow with blur
        ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
        ctx.beginPath();
        ctx.ellipse(x, y + 10, 18, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        // Car glow
        ctx.shadowBlur = 20;
        ctx.shadowColor = color;
        
        // Car body with gradient
        const carGradient = ctx.createRadialGradient(x, y, 0, x, y, 16);
        carGradient.addColorStop(0, color);
        carGradient.addColorStop(1, color + "80");
        ctx.fillStyle = carGradient;
        ctx.beginPath();
        ctx.arc(x, y, 16, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.shadowBlur = 0;

        // Car border
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 3;
        ctx.stroke();

        // Position number on car
        ctx.fillStyle = "#000";
        ctx.font = "bold 12px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(position, x, y + 5);

        // Driver name above car with background
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(x - 40, y - 35, 80, 20);
        ctx.fillStyle = "#fff";
        ctx.font = "bold 12px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(name, x, y - 22);

        // Speed indicator with background
        if (speed > 0) {
          ctx.fillStyle = "rgba(0, 255, 0, 0.8)";
          ctx.fillRect(x - 30, y - 55, 60, 18);
          ctx.fillStyle = "#000";
          ctx.font = "bold 11px sans-serif";
          ctx.fillText(`${speed.toFixed(0)} km/h`, x, y - 43);
        }

        // Pit stop indicator with animation
        if (isPitting) {
          ctx.fillStyle = "#ffaa00";
          ctx.font = "bold 16px sans-serif";
          ctx.shadowBlur = 10;
          ctx.shadowColor = "#ffaa00";
          ctx.fillText("PIT", x, y + 30);
          ctx.shadowBlur = 0;
        }
      });

      // Draw lap counter with style
      ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
      ctx.fillRect(10, 10, 150, 40);
      ctx.fillStyle = "#fff";
      ctx.font = "bold 18px sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(`Lap: ${currentLap}`, 20, 35);

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
      width={1200}
      height={350}
      style={{
        width: "100%",
        height: "350px",
        background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)",
        borderRadius: "16px",
        border: "2px solid rgba(255, 255, 255, 0.1)",
        boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
      }}
    />
  );
};

export default TrackView;
