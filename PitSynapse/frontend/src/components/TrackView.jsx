import React, { useRef, useEffect } from "react";

const TrackView = ({ agents = [], trackLength = 1000, currentLap }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;

    // Convert position (0 → trackLength) into X coordinate (0 → W)
    const scaleX = (pos) => (pos / trackLength) * W;

    const draw = () => {
      // Clear whole canvas
      ctx.clearRect(0, 0, W, H);

      // Draw track line
      ctx.strokeStyle = "#444";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(0, H / 2);
      ctx.lineTo(W, H / 2);
      ctx.stroke();

      // Draw each agent
      agents.forEach((agent, i) => {
        const x = scaleX(agent.position);
        const y = H / 2;

        // Circle
        ctx.beginPath();
        ctx.fillStyle = agent.color || "#00f";
        ctx.arc(x, y, 10, 0, Math.PI * 2);
        ctx.fill();

        // Name label
        ctx.fillStyle = "#fff";
        ctx.font = "12px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(agent.name, x, y - 15);

        // Pit icon
        if (agent.isPitting) {
          ctx.fillStyle = "yellow";
          ctx.font = "14px bold sans-serif";
          ctx.fillText("🛠", x, y + 25);
        }
      });

      // Current Lap text
      ctx.fillStyle = "#fff";
      ctx.font = "14px sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(`Lap: ${currentLap}`, 10, 20);
    };

    draw();
  }, [agents, trackLength, currentLap]); // redraw when data changes

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
        marginTop: "10px"
      }}
    />
  );
};

export default TrackView;
