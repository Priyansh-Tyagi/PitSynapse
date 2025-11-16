# PitSynapse - Local Setup Guide

## Prerequisites

- Python 3.8+ installed
- Node.js 16+ and npm installed
- Git (optional, for cloning)

## Quick Start

### 1. Backend Setup

```bash
# Navigate to project directory
cd PitSynapse

# Install Python dependencies
cd backend
pip install -r requirements.txt

# Start the backend server
# Option 1: Using the startup script (recommended)
cd ..
python start_backend.py

# Option 2: Using uvicorn directly
cd backend
python -m uvicorn main:app --reload --port 8000
```

The backend will be available at:
- API: http://localhost:8000
- API Docs: http://localhost:8000/docs
- Health Check: http://localhost:8000/health

### 2. Frontend Setup

Open a **new terminal window** (keep backend running):

```bash
# Navigate to frontend directory
cd PitSynapse/frontend

# Install dependencies (first time only)
npm install

# Start the development server
npm run dev
```

The frontend will be available at:
- http://localhost:5173 (or the port shown in terminal)

## Testing

### Test Backend API

```bash
# From project root
python test_api.py
```

### Test Simulation Directly

```bash
# From project root
python test_simulation.py
```

## Project Structure

```
PitSynapse/
├── backend/              # FastAPI backend
│   ├── main.py          # FastAPI app entry point
│   ├── routes/          # API routes
│   ├── services/        # Simulation logic
│   ├── models/          # Pydantic models
│   └── requirements.txt # Python dependencies
├── frontend/            # React frontend
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Pages
│   │   └── services/    # API client
│   └── package.json     # Node dependencies
├── data/                # Agent profiles
├── start_backend.py     # Backend startup script
├── test_api.py          # API test script
└── test_simulation.py   # Simulation test script
```

## Troubleshooting

### Backend Issues

**Port 8000 already in use:**
```bash
# Kill process on port 8000 (Windows)
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Or use a different port
uvicorn main:app --reload --port 8001
```

**Import errors:**
- Make sure you're running from the correct directory
- Check that all dependencies are installed: `pip install -r requirements.txt`

### Frontend Issues

**Port 5173 already in use:**
- Vite will automatically use the next available port
- Or specify a different port: `npm run dev -- --port 3000`

**CORS errors:**
- Make sure backend is running on port 8000
- Check that CORS is enabled in `backend/main.py`

**API connection errors:**
- Verify backend is running: http://localhost:8000/health
- Check frontend API base URL in `frontend/src/services/api.js`

## Usage

1. **Start Backend** (Terminal 1):
   ```bash
   cd PitSynapse
   python start_backend.py
   ```

2. **Start Frontend** (Terminal 2):
   ```bash
   cd PitSynapse/frontend
   npm run dev
   ```

3. **Open Browser**:
   - Go to http://localhost:5173
   - Use the Control Panel to configure race parameters
   - Click "Start Simulation"
   - Watch the race unfold in real-time!

## API Endpoints

- `GET /health` - Health check
- `GET /docs` - Interactive API documentation
- `POST /api/simulate` - Run simulation

### Example API Request

```bash
curl -X POST http://localhost:8000/api/simulate \
  -H "Content-Type: application/json" \
  -d '{
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
  }'
```

## Development

### Backend Development
- Backend uses FastAPI with auto-reload
- Changes to Python files will automatically restart the server
- Check logs in the terminal for errors

### Frontend Development
- Frontend uses Vite with hot module replacement
- Changes to React files will automatically update in browser
- Check browser console for errors

## Production Build

### Backend
```bash
# No build needed, just run with uvicorn
uvicorn backend.main:app --host 0.0.0.0 --port 8000
```

### Frontend
```bash
cd frontend
npm run build
# Output in frontend/dist/
```

## Need Help?

- Check `TEST_RESULTS.md` for test results
- Check `README.md` for project overview
- Review API docs at http://localhost:8000/docs when server is running

