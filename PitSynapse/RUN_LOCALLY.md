# How to Run PitSynapse Locally

## 🎯 Quick Start (2 Terminals)

### Terminal 1 - Backend

```bash
# Navigate to project
cd PitSynapse

# Install Python dependencies (first time only)
cd backend
pip install -r requirements.txt

# Go back to root and start backend
cd ..
python start_backend.py
```

**✅ Backend will be running at:** http://localhost:8000

### Terminal 2 - Frontend

```bash
# Navigate to frontend
cd PitSynapse/frontend

# Install Node dependencies (first time only)
npm install

# Start frontend dev server
npm run dev
```

**✅ Frontend will be running at:** http://localhost:5173

## 🌐 Access the Application

1. Open your browser
2. Go to: **http://localhost:5173**
3. You should see the PitSynapse Dashboard!

## 🧪 Verify It's Working

### Test Backend:
```bash
# In a new terminal
python test_api.py
```

### Test Simulation:
```bash
# In a new terminal
python test_simulation.py
```

### Manual API Test:
Open http://localhost:8000/docs in your browser for interactive API documentation.

## 📋 Step-by-Step Details

### 1. Backend Setup

**First Time Setup:**
```bash
cd PitSynapse/backend
pip install -r requirements.txt
```

**Start Server:**
```bash
# From PitSynapse directory
python start_backend.py
```

**What you'll see:**
```
Starting PitSynapse Backend Server...
Server will be available at http://localhost:8000
API docs at http://localhost:8000/docs
```

**Alternative (if startup script doesn't work):**
```bash
cd PitSynapse/backend
python -m uvicorn main:app --reload --port 8000
```

### 2. Frontend Setup

**First Time Setup:**
```bash
cd PitSynapse/frontend
npm install
```

**Start Dev Server:**
```bash
npm run dev
```

**What you'll see:**
```
  VITE v7.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### 3. Using the Application

1. **Configure Race:**
   - Set total laps (1-100)
   - Choose weather (dry/rain/mixed)
   - Select number of agents (2-5)

2. **Start Simulation:**
   - Click "Start Simulation"
   - Wait for simulation to complete (1-3 seconds)

3. **Watch the Race:**
   - Track view shows agents on track
   - Leaderboard updates in real-time
   - Charts show lap times and tyre wear
   - Event log shows all race events

4. **Playback Controls:**
   - Use Play/Pause to control playback
   - Use Reset to restart from beginning

## 🔧 Troubleshooting

### Backend Won't Start

**Error: "Module not found"**
```bash
# Make sure you're in the right directory
cd PitSynapse
python start_backend.py
```

**Error: "Port 8000 already in use"**
```bash
# Windows: Find and kill process
netstat -ano | findstr :8000
taskkill /PID <PID_NUMBER> /F

# Or use different port (update frontend/api.js too)
uvicorn main:app --reload --port 8001
```

**Error: "pip: command not found"**
- Install Python from python.org
- Make sure Python is in your PATH
- Try `python -m pip` instead of `pip`

### Frontend Won't Start

**Error: "npm: command not found"**
- Install Node.js from nodejs.org
- Restart terminal after installation

**Error: "Port 5173 already in use"**
- Vite will automatically use next available port
- Check terminal for the actual port number

**Error: "Cannot connect to backend"**
- Make sure backend is running on port 8000
- Check http://localhost:8000/health in browser
- Verify CORS is enabled in backend/main.py

### Frontend Shows Errors

**"Network Error" or "Failed to fetch"**
- Backend must be running first
- Check backend is on http://localhost:8000
- Check browser console for detailed errors

**Blank Screen**
- Check browser console (F12) for errors
- Make sure all npm packages installed: `npm install`
- Try clearing browser cache

## 📁 Project Structure

```
PitSynapse/
├── backend/              # Python FastAPI backend
│   ├── main.py          # Server entry point
│   ├── routes/          # API endpoints
│   ├── services/        # Simulation engine
│   └── requirements.txt # Python packages
│
├── frontend/            # React frontend
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── pages/       # Pages
│   │   └── services/    # API client
│   └── package.json     # Node packages
│
├── data/                # Agent profiles
├── start_backend.py     # Backend launcher
├── test_api.py          # API tests
└── test_simulation.py   # Simulation tests
```

## 🎓 Understanding the Flow

1. **User clicks "Start Simulation"** in frontend
2. **Frontend sends POST request** to `/api/simulate`
3. **Backend runs simulation** (lap-by-lap)
4. **Backend returns** timeline + summary + events
5. **Frontend displays** results with animation

## 🔍 Useful URLs

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs
- **Health Check:** http://localhost:8000/health

## 💡 Tips

- Keep both terminals open (backend + frontend)
- Backend must be running before frontend can work
- Check terminal output for errors
- Use browser DevTools (F12) to debug frontend
- Use http://localhost:8000/docs to test API directly

## ✅ Success Checklist

- [ ] Backend running on port 8000
- [ ] Frontend running on port 5173
- [ ] Can access http://localhost:5173
- [ ] Can see dashboard UI
- [ ] Can start a simulation
- [ ] Can see race results

If all checked, you're ready to go! 🎉

