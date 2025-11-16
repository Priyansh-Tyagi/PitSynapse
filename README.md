# PitSynapse - Multi-Agent Race Simulation

A hackathon-ready F1-style multi-agent race simulation with AI-driven strategy, pace, and overtaking decisions.

## 🚀 Features

- **Lap-by-lap progression** with realistic physics
- **AI Agent Behavior**:
  - Strategy AI → pit-stop decisions, tyre choice
  - Pace AI → push/conserve decisions
  - Overtake AI → probability-based passing
  - Environment AI → weather, track grip
- **Pseudo-RL Learning** - agents adapt lap-to-lap
- **Live Leaderboard** with speed, lap times, tyre status
- **Frontend Dashboard** with:
  - Track animation (Canvas)
  - Live leaderboard
  - Lap time & tyre wear charts (Chart.js)
  - Event log
  - Control panel

## 🎮 Quick Start

### One-Command Setup (Windows)

**Easiest way:**
```bash
# Double-click start.bat
# Or run:
start.bat
```

**PowerShell:**
```powershell
.\start.ps1
```

### Manual Setup

**Backend:**
```bash
cd PitSynapse/backend
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```

**Frontend:**
```bash
cd PitSynapse/frontend
npm install
npm run dev
```

**Access:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## 📁 Project Structure

```
PitSynapse/
├── backend/              # FastAPI backend
│   ├── main.py          # Server entry point
│   ├── routes/          # API endpoints
│   ├── services/        # Simulation engine
│   ├── models/          # Pydantic models
│   └── requirements.txt # Python dependencies
├── frontend/            # React frontend
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── pages/     # Pages
│   │   └── services/    # API client
│   └── package.json     # Node dependencies
├── data/                # Agent profiles
├── start.bat            # Windows startup script
├── start.ps1            # PowerShell startup script
└── README.md            # This file
```

## 🧪 Testing

```bash
# Test API
python test_api.py

# Test simulation
python test_simulation.py
```

## 📚 API Endpoints

- `GET /health` - Health check
- `GET /docs` - Interactive API documentation
- `POST /api/simulate` - Run simulation

### Example Request

```json
{
  "race": {
    "total_laps": 10,
    "weather": "dry",
    "track_id": "default"
  },
  "agents": [
    {
      "id": "agent_1",
      "name": "Aggressive Racer",
      "aggression": 0.9,
      "risk_taking": 0.85,
      "tyre_management": 0.4,
      "pit_bias": 0.3
    }
  ]
}
```

## 🛠️ Tech Stack

- **Backend:** FastAPI, Python, Pydantic
- **Frontend:** React, Vite, Tailwind CSS, Chart.js
- **AI:** Pseudo-Reinforcement Learning for agent adaptation

## 📝 License

MIT

## 🤝 Contributing

This is a hackathon project. Feel free to fork and improve!

## 📧 Contact

For questions or issues, please open an issue on GitHub.

