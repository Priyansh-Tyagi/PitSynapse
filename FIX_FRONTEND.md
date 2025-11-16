# Fix Frontend Blank Page Issue

## Quick Fix Steps

### 1. Stop Current Frontend Server
- Close the terminal window running `npm run dev`
- Or press `Ctrl+C` in that terminal

### 2. Restart Frontend Server

Open a NEW terminal and run:

```bash
cd C:\Users\priya\Downloads\PitSynapse\PitSynapse\PitSynapse\frontend
npm run dev
```

**Wait for this message:**
```
  VITE v7.x.x  ready in xxx ms
  ➜  Local:   http://localhost:5173/
```

### 3. Open Browser

Go to: **http://localhost:5173**

### 4. Check Browser Console

If still blank:
1. Press **F12** in browser
2. Go to **Console** tab
3. Look for red error messages
4. Share the error message

## Common Issues

### Issue: "Cannot GET /"
**Fix:** Make sure you're going to http://localhost:5173 (not 8000)

### Issue: "Module not found"
**Fix:** Run `npm install` in frontend directory

### Issue: "Failed to fetch" or "Network error"
**Fix:** 
1. Make sure backend is running on port 8000
2. Check: http://localhost:8000/health
3. Should return: `{"status":"ok"}`

### Issue: Blank white page
**Fix:**
1. Check browser console (F12)
2. Clear browser cache (Ctrl+Shift+Delete)
3. Hard refresh (Ctrl+F5)

## Verify Everything is Running

**Backend:**
```bash
curl http://localhost:8000/health
# Should return: {"status":"ok"}
```

**Frontend:**
- Open: http://localhost:5173
- Should show: PitSynapse Dashboard with control panel

## Still Not Working?

1. **Check both servers are running:**
   - Backend terminal should show: "Uvicorn running on..."
   - Frontend terminal should show: "Local: http://localhost:5173/"

2. **Try different browser:**
   - Chrome, Firefox, or Edge

3. **Check firewall:**
   - Windows Firewall might be blocking ports

4. **Reinstall dependencies:**
   ```bash
   cd frontend
   rm -rf node_modules
   npm install
   npm run dev
   ```

