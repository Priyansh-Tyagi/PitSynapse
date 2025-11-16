# PitSynapse - Competitive Mobility Systems Simulator

A professional-grade multi-agent race simulation platform with AI-driven strategy, real-time visualization, and competitive mobility modeling.

## 🏎️ Applications

- **Formula E** - Electric racing simulation
- **MotoGP** - Motorcycle racing dynamics
- **Drones** - Aerial racing competitions
- **Supply Chain** - Logistics race optimization
- **Traffic Flow** - Urban mobility management

## ✨ Features

### Core Simulation
- **Lap-by-lap progression** with realistic physics
- **Multi-agent racing** (2-5 competitors)
- **Real-time position tracking** with smooth animations
- **Performance curves** derived from F1 telemetry
- **Weather adaptation** (dry, rain, mixed)

### AI Agent Behavior
- **Strategy AI** → Intelligent pit-stop decisions, tyre choice
- **Pace AI** → Push/conserve decisions based on race state
- **Overtake AI** → Probability-based passing mechanics
- **Environment AI** → Weather and track grip adaptation

### Pseudo-RL Learning
- **Lap-by-lap adaptation** of agent traits
- **Dynamic behavior adjustment** based on performance
- **Reward-based learning** for strategy optimization
- **Trait evolution** (aggression, risk, tyre management, pit bias)

### Live Visualization
- **Track View** - Smooth car animations with speed indicators
- **Live Leaderboard** - Real-time position updates with gaps
- **Lap Time Charts** - Performance visualization (Chart.js)
- **Tyre Wear Charts** - Degradation tracking
- **Event Log** - Filterable race events
- **Control Panel** - Race configuration

### Backend API
- **FastAPI** - High-performance async API
- **RESTful endpoints** - `/api/simulate`, `/health`, `/docs`
- **JSON timeline format** - Frontend-ready playback
- **Comprehensive event system** - Pit stops, overtakes, PRL updates

## 🚀 Quick Start

### One-Command Setup (Windows)

```bash
# Double-click start.bat
# Or run:
start.bat
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
│   │   │   ├── TrackView.jsx      # Animated track
│   │   │   ├── LiveLeaderboard.jsx # Real-time leaderboard
│   │   │   ├── ControlPanel.jsx   # Race controls
│   │   │   ├── LapChart.jsx       # Performance charts
│   │   │   ├── TyreChart.jsx      # Tyre wear charts
│   │   │   └── EventLog.jsx       # Event log
│   │   ├── pages/       # Pages
│   │   ├── hooks/       # React hooks
│   │   └── services/   # API client
│   └── package.json     # Node dependencies
├── data/                # Agent profiles
├── start.bat            # Windows startup script
└── README.md            # This file
```

## 🎮 Usage

1. **Configure Race:**
   - Set total laps (1-100)
   - Choose weather (dry/rain/mixed)
   - Select number of agents (2-5)

2. **Start Simulation:**
   - Click "Start Simulation"
   - Wait 1-3 seconds for computation

3. **Watch the Race:**
   - Track view shows animated cars
   - Leaderboard updates in real-time
   - Charts display performance metrics
   - Event log shows all race events

4. **Control Playback:**
   - Play/Pause buttons
   - Reset to restart
   - View race time and lap progress

## 📊 API Endpoints

### `POST /api/simulate`
Run a race simulation.

**Request:**
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

**Response:**
```json
{
  "timeline": [...],
  "summary": {
    "winner": "Agent Name",
    "fastest_lap": 88.5,
    "avg_tyre_wear": 25.3,
    "pit_stops": {...}
  },
  "events": [...]
}
```

### `GET /health`
Health check endpoint.

### `GET /docs`
Interactive API documentation (Swagger UI).

## 🛠️ Tech Stack

- **Backend:** FastAPI, Python, Pydantic
- **Frontend:** React, Vite, Tailwind CSS, Chart.js
- **AI:** Pseudo-Reinforcement Learning
- **Visualization:** Canvas API, Chart.js

## 🧪 Testing

```bash
# Test API
python test_api.py

# Test simulation
python test_simulation.py
```

## 📝 License

MIT

## 🤝 Contributing

This is a hackathon project. Feel free to fork and improve!

## 🌟 Features Highlights

- ✅ Smooth 60fps animations
- ✅ Real-time leaderboard updates
- ✅ Professional racing UI
- ✅ Multi-application support
- ✅ AI-driven agent behavior
- ✅ Comprehensive event system
- ✅ Performance analytics
