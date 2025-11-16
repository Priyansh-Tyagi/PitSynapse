# PitSynapse - Multi-Agent Race Simulation MVP

A hackathon-ready F1-style multi-agent race simulation with AI-driven strategy, pace, and overtaking decisions.

## Features

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

## Setup

### Backend

```bash
cd PitSynapse/backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Frontend

```bash
cd PitSynapse/frontend
npm install
npm run dev
```

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/simulate` - Run simulation

### Simulation Request Format

```json
{
  "race": {
    "total_laps": 50,
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

## Project Structure

```
PitSynapse/
├── backend/
│   ├── models/          # Pydantic event models
│   ├── routes/          # FastAPI routes
│   ├── services/        # Simulation logic
│   └── main.py          # FastAPI app
├── frontend/
│   └── src/
│       ├── components/  # React components
│       ├── pages/       # Dashboard page
│       └── services/    # API client
└── data/
    └── agent_profiles.json
```

## Testing

The simulation has been optimized and tested for:
- Multi-agent racing (2-5 agents)
- Lap-by-lap progression
- Pit stop decisions
- Overtake detection
- PRL trait adaptation
- Weather effects
- Frontend visualization

## License

MIT

