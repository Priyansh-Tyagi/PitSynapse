@echo off
REM PitSynapse - One-Command Startup Script (Windows Batch)
REM Double-click this file or run: start.bat

echo ========================================
echo   PitSynapse - Starting Everything...
echo ========================================
echo.

REM Change to script directory
cd /d "%~dp0"

REM Check if we need to go into nested PitSynapse directory
if exist "PitSynapse\backend" (
    echo [INFO] Found nested directory structure, navigating...
    cd PitSynapse
)

REM Verify backend exists
if not exist "backend" (
    echo [ERROR] Backend directory not found!
    echo.
    echo Current directory: %CD%
    echo.
    echo Please make sure you're running this from the PitSynapse root directory.
    echo The directory should contain both 'backend' and 'frontend' folders.
    pause
    exit /b 1
)

REM Check Python
echo [1/5] Checking Python...
python --version >nul 2>&1
if errorlevel 1 (
    echo   [ERROR] Python not found! Please install Python 3.8+
    pause
    exit /b 1
)
echo   [OK] Python found
echo.

REM Check Node.js
echo [2/5] Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo   [ERROR] Node.js not found! Please install Node.js
    pause
    exit /b 1
)
echo   [OK] Node.js found
echo.

REM Store current directory
set "PROJECT_ROOT=%CD%"

REM Install Python dependencies
echo [3/5] Installing Python dependencies...
cd "%PROJECT_ROOT%\backend"
if exist requirements.txt (
    python -m pip install -q -r requirements.txt
    if errorlevel 1 (
        echo   [WARN] Some packages may have failed to install
    ) else (
        echo   [OK] Python dependencies installed
    )
) else (
    echo   [WARN] requirements.txt not found
)
cd "%PROJECT_ROOT%"
echo.

REM Install Node.js dependencies
echo [4/5] Installing Node.js dependencies...
cd "%PROJECT_ROOT%\frontend"
if exist package.json (
    call npm install --silent
    if errorlevel 1 (
        echo   [WARN] Some packages may have failed to install
    ) else (
        echo   [OK] Node.js dependencies installed
    )
) else (
    echo   [WARN] package.json not found
)
cd "%PROJECT_ROOT%"
echo.

REM Start servers
echo [5/5] Starting servers...
echo.

REM Start backend in new window
echo   Starting Backend Server...
start "PitSynapse Backend" cmd /k "cd /d %PROJECT_ROOT%\backend && python -m uvicorn main:app --host 0.0.0.0 --port 8000"

REM Wait a bit
timeout /t 3 /nobreak >nul

REM Start frontend in new window
echo   Starting Frontend Server...
start "PitSynapse Frontend" cmd /k "cd /d %PROJECT_ROOT%\frontend && npm run dev"

REM Wait for servers
echo.
echo   Waiting for servers to start...
timeout /t 8 /nobreak >nul

REM Open browser
echo.
echo ========================================
echo   PitSynapse is Running!
echo ========================================
echo.
echo   Backend:  http://localhost:8000
echo   Frontend: http://localhost:5173
echo   API Docs: http://localhost:8000/docs
echo.
echo   Opening browser...
timeout /t 2 /nobreak >nul
start http://localhost:5173

echo.
echo ========================================
echo   Servers are running in separate windows
echo   Close those windows to stop the servers
echo ========================================
echo.
pause
