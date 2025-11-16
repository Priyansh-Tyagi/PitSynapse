# How to Run PitSynapse - Simple Guide

## From Your Current Location

You're in: `~/Downloads/PitSynapse/PitSynapse`

### Option 1: Use the Script (Recommended)

```bash
bash start.sh
```

### Option 2: Manual Commands (If script doesn't work)

**Terminal 1 - Backend:**
```bash
cd PitSynapse/backend
python -m pip install -r requirements.txt
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd PitSynapse/frontend
npm install
npm run dev
```

**Then open:** http://localhost:5173

### Option 3: Use Windows Batch File

If you're on Windows, just double-click:
```
start.bat
```

## Quick Test

To verify everything is set up:

```bash
# Check Python
python --version

# Check Node
node --version

# Check if backend exists
ls PitSynapse/backend

# Check if frontend exists
ls PitSynapse/frontend
```

## If Script Fails

1. Check the error message
2. Make sure you're in: `~/Downloads/PitSynapse/PitSynapse`
3. Verify Python and Node are installed
4. Use manual commands (Option 2) instead

