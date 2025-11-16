# Frontend Troubleshooting Guide

## If Frontend Shows Blank Page

### Step 1: Check if Frontend Server is Running

Open a terminal and check:
```bash
cd PitSynapse\PitSynapse\frontend
npm run dev
```

You should see:
```
  VITE v7.x.x  ready in xxx ms
  ➜  Local:   http://localhost:5173/
```

### Step 2: Check Browser Console

1. Open browser (Chrome/Firefox/Edge)
2. Press F12 to open Developer Tools
3. Go to "Console" tab
4. Look for any red error messages

Common errors:
- **Module not found**: Need to run `npm install`
- **Cannot connect to backend**: Backend not running
- **CORS error**: Backend CORS not configured

### Step 3: Reinstall Dependencies

```bash
cd PitSynapse\PitSynapse\frontend
rm -rf node_modules
npm install
npm run dev
```

### Step 4: Check Backend is Running

Frontend needs backend to be running on port 8000.

Check: http://localhost:8000/health
Should return: `{"status":"ok"}`

### Step 5: Clear Browser Cache

1. Press Ctrl+Shift+Delete
2. Clear cached images and files
3. Refresh page (Ctrl+F5)

### Step 6: Check Port Conflicts

If port 5173 is in use:
- Vite will automatically use next available port
- Check terminal for actual port number
- Or kill process: `netstat -ano | findstr :5173`

## Quick Fix Commands

**Reinstall everything:**
```bash
cd PitSynapse\PitSynapse\frontend
npm install
npm run dev
```

**Check for errors:**
```bash
npm run dev
# Look for error messages in terminal
```

**Verify backend:**
```bash
curl http://localhost:8000/health
# Should return: {"status":"ok"}
```

## Still Not Working?

1. Check both terminals (backend + frontend) for errors
2. Make sure you're accessing: http://localhost:5173 (not 8000)
3. Try a different browser
4. Check Windows Firewall isn't blocking ports

