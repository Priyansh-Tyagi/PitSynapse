# Quick Start Guide - PitSynapse

## 🚀 Get Running in 3 Steps

### Step 1: Install Dependencies

**Backend:**
```bash
cd PitSynapse/backend
pip install -r requirements.txt
```

**Frontend:**
```bash
cd PitSynapse/frontend
npm install
```

### Step 2: Start Backend (Terminal 1)

```bash
cd PitSynapse
python start_backend.py
```

✅ Backend running at http://localhost:8000

### Step 3: Start Frontend (Terminal 2)

```bash
cd PitSynapse/frontend
npm run dev
```

✅ Frontend running at http://localhost:5173

## 🎮 Use It!

1. Open http://localhost:5173 in your browser
2. Adjust race parameters (laps, weather, agents)
3. Click "Start Simulation"
4. Watch the race!

## 🧪 Test It

```bash
# Test API
python test_api.py

# Test simulation
python test_simulation.py
```

## 📚 More Info

- Full setup: See `SETUP.md`
- API docs: http://localhost:8000/docs (when backend is running)

