# 🚀 EXACT COMMANDS TO RUN THE PROJECT

## ⚠️ IMPORTANT: You Need 2 Terminal Windows!

---

## 📋 TERMINAL 1 - Backend Server

**Copy and paste these commands one by one:**

```powershell
# Navigate to project
cd C:\Users\priya\Downloads\PitSynapse\PitSynapse

# Install dependencies (ONLY FIRST TIME - skip if already done)
cd backend
pip install -r requirements.txt
cd ..

# Start the backend server
python start_backend.py
```

**✅ You should see:**
```
Starting PitSynapse Backend Server...
Server will be available at http://localhost:8000
```

**⚠️ KEEP THIS TERMINAL OPEN!**

---

## 📋 TERMINAL 2 - Frontend Server

**Open a NEW terminal window, then copy and paste:**

```powershell
# Navigate to frontend
cd C:\Users\priya\Downloads\PitSynapse\PitSynapse\frontend

# Install dependencies (ONLY FIRST TIME - skip if already done)
npm install

# Start the frontend server
npm run dev
```

**✅ You should see:**
```
  VITE v7.x.x  ready in xxx ms
  ➜  Local:   http://localhost:5173/
```

**⚠️ KEEP THIS TERMINAL OPEN!**

---

## 🌐 STEP 3 - Open in Browser

1. Open your web browser (Chrome, Firefox, Edge, etc.)
2. Go to: **http://localhost:5173**
3. You should see the PitSynapse Dashboard!

---

## 🎮 How to Use

1. **Set Race Parameters:**
   - Total Laps: Use the slider (1-100)
   - Weather: Choose from dropdown (dry/rain/mixed)
   - Number of Agents: Use slider (2-5)

2. **Start Simulation:**
   - Click the "Start Simulation" button
   - Wait 1-3 seconds

3. **Watch the Race:**
   - Track view shows agents racing
   - Leaderboard updates
   - Charts show performance
   - Event log shows all events

---

## ❌ Common Errors & Fixes

### Error: "python: command not found"
**Fix:** Use `py` instead:
```powershell
py start_backend.py
```

### Error: "pip: command not found"
**Fix:** Use:
```powershell
python -m pip install -r requirements.txt
```

### Error: "npm: command not found"
**Fix:** Install Node.js from https://nodejs.org/

### Error: "Module not found" (Python)
**Fix:** Make sure you installed dependencies:
```powershell
cd backend
pip install -r requirements.txt
```

### Error: "Port 8000 already in use"
**Fix:** Kill the process:
```powershell
netstat -ano | findstr :8000
taskkill /PID <PID_NUMBER> /F
```

### Error: "Cannot connect to backend"
**Fix:**
1. Make sure Terminal 1 (backend) is still running
2. Check http://localhost:8000/health in browser
3. Should show: `{"status":"ok"}`

---

## ✅ Quick Verification

**Test Backend:**
- Open: http://localhost:8000/health
- Should show: `{"status":"ok"}`

**Test Frontend:**
- Open: http://localhost:5173
- Should show: PitSynapse Dashboard

---

## 📝 Summary

**Two terminals, two commands:**

**Terminal 1:**
```powershell
cd C:\Users\priya\Downloads\PitSynapse\PitSynapse
python start_backend.py
```

**Terminal 2:**
```powershell
cd C:\Users\priya\Downloads\PitSynapse\PitSynapse\frontend
npm run dev
```

**Browser:**
http://localhost:5173

---

## 🆘 Still Not Working?

1. Make sure both terminals show no errors
2. Check that Python 3.8+ is installed: `python --version`
3. Check that Node.js is installed: `node --version`
4. Try restarting both terminals
5. Make sure ports 8000 and 5173 are free

