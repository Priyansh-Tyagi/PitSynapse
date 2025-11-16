# 🚀 One-Command Startup

## Windows (PowerShell)

**Just run:**
```powershell
.\start.ps1
```

Or double-click `start.ps1` in File Explorer.

---

## Windows (Command Prompt)

**Just run:**
```cmd
start.bat
```

Or double-click `start.bat` in File Explorer.

---

## Linux/Mac

**Just run:**
```bash
chmod +x start.sh
./start.sh
```

---

## What It Does

1. ✅ Checks if Python and Node.js are installed
2. ✅ Installs all dependencies automatically
3. ✅ Starts backend server (port 8000)
4. ✅ Starts frontend server (port 5173)
5. ✅ Opens browser automatically

**That's it!** Everything runs with one command.

---

## Manual Start (If Scripts Don't Work)

### Terminal 1:
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```

### Terminal 2:
```bash
cd frontend
npm install
npm run dev
```

### Browser:
http://localhost:5173

---

## Troubleshooting

**Script won't run?**
- Windows: Right-click → "Run with PowerShell"
- Make sure execution policy allows scripts: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`

**Still having issues?**
- Use the manual start method above
- Check that Python 3.8+ and Node.js 16+ are installed

