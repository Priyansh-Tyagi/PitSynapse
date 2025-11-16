# 🚀 START HERE - Run PitSynapse Locally

## Step-by-Step Commands

### Step 1: Open Terminal 1 (Backend)

```bash
# Navigate to project
cd PitSynapse

# Install dependencies (ONLY FIRST TIME)
cd backend
pip install -r requirements.txt

# Go back to root
cd ..

# Start backend server
python start_backend.py
```

**You should see:**
```
Starting PitSynapse Backend Server...
Server will be available at http://localhost:8000
```

**Keep this terminal open!**

---

### Step 2: Open Terminal 2 (Frontend)

**Open a NEW terminal window** (keep Terminal 1 running!)

```bash
# Navigate to frontend
cd PitSynapse/frontend

# Install dependencies (ONLY FIRST TIME)
npm install

# Start frontend server
npm run dev
```

**You should see:**
```
  VITE v7.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

**Keep this terminal open!**

---

### Step 3: Open Browser

1. Open your web browser
2. Go to: **http://localhost:5173**
3. You should see the PitSynapse Dashboard!

---

## 🔧 If You Get Errors

### Error: "pip: command not found"
```bash
# Try this instead:
python -m pip install -r requirements.txt
```

### Error: "npm: command not found"
- Install Node.js from: https://nodejs.org/
- Restart terminal after installing

### Error: "Module not found" (Python)
```bash
# Make sure you're in the right directory
cd PitSynapse/backend
pip install -r requirements.txt
```

### Error: "Port 8000 already in use"
```bash
# Windows: Find what's using port 8000
netstat -ano | findstr :8000

# Kill the process (replace <PID> with the number shown)
taskkill /PID <PID> /F
```

### Error: "Cannot connect to backend"
1. Make sure backend is running in Terminal 1
2. Check http://localhost:8000/health in browser
3. Should return: `{"status":"ok"}`

---

## ✅ Quick Verification

### Test Backend:
Open browser: http://localhost:8000/health
Should show: `{"status":"ok"}`

### Test Frontend:
Open browser: http://localhost:5173
Should show: PitSynapse Dashboard

---

## 📝 Summary

**Two terminals needed:**

**Terminal 1:**
```bash
cd PitSynapse
python start_backend.py
```

**Terminal 2:**
```bash
cd PitSynapse/frontend
npm run dev
```

**Then open:** http://localhost:5173

---

## 🆘 Still Having Issues?

1. Check both terminals for error messages
2. Make sure Python 3.8+ is installed
3. Make sure Node.js 16+ is installed
4. Try restarting both terminals
5. Check that ports 8000 and 5173 are not in use

