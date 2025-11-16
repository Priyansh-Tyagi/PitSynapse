@echo off
cd PitSynapse\backend && start "Backend" cmd /k "python -m uvicorn main:app --port 8000" && timeout /t 2 /nobreak >nul && cd ..\frontend && start "Frontend" cmd /k "npm run dev" && timeout /t 3 /nobreak >nul && start http://localhost:5173

