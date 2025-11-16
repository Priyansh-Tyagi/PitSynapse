# One-Line Commands to Run PitSynapse

## Windows PowerShell (One Line)

```powershell
cd PitSynapse/backend; Start-Process powershell -ArgumentList "-NoExit", "-Command", "python -m uvicorn main:app --port 8000"; Start-Sleep 2; cd ../frontend; Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev"; Start-Sleep 3; Start-Process http://localhost:5173
```

## Windows CMD (One Line)

```cmd
cd PitSynapse\backend && start "Backend" cmd /k "python -m uvicorn main:app --port 8000" && timeout /t 2 /nobreak >nul && cd ..\frontend && start "Frontend" cmd /k "npm run dev" && timeout /t 3 /nobreak >nul && start http://localhost:5173
```

## Git Bash / Linux / Mac (One Line)

```bash
cd PitSynapse/backend && python -m uvicorn main:app --port 8000 > ../backend.log 2>&1 & cd ../frontend && npm run dev > ../frontend.log 2>&1 & sleep 5 && echo "Servers starting! Backend: http://localhost:8000, Frontend: http://localhost:5173"
```

## Simplest: Use the Batch File

**Windows:**
```cmd
start.bat
```

**Or double-click:** `start.bat`

## Copy-Paste Ready Commands

### Windows PowerShell:
```powershell
cd PitSynapse/backend; Start-Process powershell -ArgumentList "-NoExit", "-Command", "python -m uvicorn main:app --port 8000"; Start-Sleep 2; cd ../frontend; Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev"; Start-Sleep 3; Start-Process http://localhost:5173
```

### Git Bash:
```bash
cd PitSynapse/backend && python -m uvicorn main:app --port 8000 & cd ../frontend && npm run dev & sleep 5 && echo "Open http://localhost:5173"
```

