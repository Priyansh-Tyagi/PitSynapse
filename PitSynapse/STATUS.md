# 🚀 PitSynapse Status

## Servers Running

✅ **Backend Server**: http://localhost:8000
- Health Check: http://localhost:8000/health
- API Docs: http://localhost:8000/docs
- Simulation Endpoint: http://localhost:8000/api/simulate

✅ **Frontend Server**: http://localhost:5173
- Dashboard: http://localhost:5173

## 🎮 How to Use

1. **Open your browser** and go to: **http://localhost:5173**

2. **Configure the race:**
   - Set total laps (slider)
   - Choose weather (dropdown)
   - Select number of agents (slider)

3. **Start the simulation:**
   - Click "Start Simulation" button
   - Wait 1-3 seconds for simulation to complete

4. **Watch the race:**
   - Track view shows agents racing
   - Leaderboard updates in real-time
   - Charts display lap times and tyre wear
   - Event log shows all race events

5. **Control playback:**
   - Use Play/Pause buttons
   - Use Reset to restart

## 🧪 Test the API

Open a new terminal and run:
```bash
python test_api.py
```

## 📊 What You'll See

- **Track View**: Visual representation of agents on track
- **Leaderboard**: Real-time position rankings
- **Lap Time Chart**: Performance over time
- **Tyre Wear Chart**: Tyre degradation
- **Event Log**: Pit stops, overtakes, PRL updates

## 🛑 To Stop Servers

Press `Ctrl+C` in both terminal windows where servers are running.

## 🔄 Restart Servers

If you need to restart:

**Backend:**
```bash
cd PitSynapse
python start_backend.py
```

**Frontend:**
```bash
cd PitSynapse/frontend
npm run dev
```

