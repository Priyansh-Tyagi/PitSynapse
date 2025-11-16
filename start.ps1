# PitSynapse - One-Command Startup Script
# Run: .\start.ps1 or: powershell -ExecutionPolicy Bypass -File .\start.ps1

$ErrorActionPreference = "Continue"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  PitSynapse - Starting Everything..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Get the script directory
$scriptDir = $PSScriptRoot
if (-not $scriptDir) {
    $scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
}
Set-Location $scriptDir

# Check if we need to go into nested PitSynapse directory
if (Test-Path (Join-Path $scriptDir "PitSynapse\backend")) {
    Write-Host "[INFO] Found nested directory structure, navigating..." -ForegroundColor Yellow
    $scriptDir = Join-Path $scriptDir "PitSynapse"
    Set-Location $scriptDir
}

# Verify backend exists
$backendPath = Join-Path $scriptDir "backend"
if (-not (Test-Path $backendPath)) {
    Write-Host "[ERROR] Backend directory not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Current directory: $scriptDir" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please make sure you're running this from the PitSynapse root directory." -ForegroundColor Yellow
    Write-Host "The directory should contain both 'backend' and 'frontend' folders." -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if Python is installed
Write-Host "[1/5] Checking Python..." -ForegroundColor Yellow
$pythonCmd = $null
if (Get-Command python -ErrorAction SilentlyContinue) {
    $pythonCmd = "python"
} elseif (Get-Command py -ErrorAction SilentlyContinue) {
    $pythonCmd = "py"
} else {
    Write-Host "  [ERROR] Python not found! Please install Python 3.8+" -ForegroundColor Red
    Write-Host "  Download from: https://www.python.org/downloads/" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}
try {
    $pythonVersion = & $pythonCmd --version 2>&1
    Write-Host "  [OK] Python found: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "  [ERROR] Python check failed" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if Node.js is installed
Write-Host "[2/5] Checking Node.js..." -ForegroundColor Yellow
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "  [ERROR] Node.js not found! Please install Node.js" -ForegroundColor Red
    Write-Host "  Download from: https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}
try {
    $nodeVersion = node --version
    Write-Host "  [OK] Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "  [ERROR] Node.js check failed" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Install Python dependencies
Write-Host "[3/5] Installing Python dependencies..." -ForegroundColor Yellow
if (Test-Path (Join-Path $backendPath "requirements.txt")) {
    Set-Location $backendPath
    & $pythonCmd -m pip install -q -r requirements.txt
    if ($LASTEXITCODE -eq 0 -or $?) {
        Write-Host "  [OK] Python dependencies installed" -ForegroundColor Green
    } else {
        Write-Host "  [WARN] Some packages may have failed to install" -ForegroundColor Yellow
    }
} else {
    Write-Host "  [WARN] requirements.txt not found, skipping..." -ForegroundColor Yellow
}
Set-Location $scriptDir

# Install Node.js dependencies
Write-Host "[4/5] Installing Node.js dependencies..." -ForegroundColor Yellow
$frontendPath = Join-Path $scriptDir "frontend"
if (Test-Path (Join-Path $frontendPath "package.json")) {
    Set-Location $frontendPath
    npm install --silent 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0 -or $?) {
        Write-Host "  [OK] Node.js dependencies installed" -ForegroundColor Green
    } else {
        Write-Host "  [WARN] Some packages may have failed to install" -ForegroundColor Yellow
    }
} else {
    Write-Host "  [WARN] package.json not found, skipping..." -ForegroundColor Yellow
}
Set-Location $scriptDir

# Start servers
Write-Host "[5/5] Starting servers..." -ForegroundColor Yellow
Write-Host ""

# Start backend in new window
Write-Host "  Starting Backend Server..." -ForegroundColor Cyan
$backendCmd = "cd '$backendPath'; $pythonCmd -m uvicorn main:app --host 0.0.0.0 --port 8000"
Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendCmd -WindowStyle Normal

# Wait a bit for backend to start
Start-Sleep -Seconds 3

# Start frontend in new window
Write-Host "  Starting Frontend Server..." -ForegroundColor Cyan
$frontendCmd = "cd '$frontendPath'; npm run dev"
Start-Process powershell -ArgumentList "-NoExit", "-Command", $frontendCmd -WindowStyle Normal

# Wait for servers to be ready
Write-Host ""
Write-Host "  Waiting for servers to start (this may take 10-20 seconds)..." -ForegroundColor Yellow
Start-Sleep -Seconds 8

# Check if servers are running
$backendReady = $false
$frontendReady = $false

for ($i = 0; $i -lt 10; $i++) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8000/health" -TimeoutSec 2 -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            $backendReady = $true
        }
    } catch {}
    
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:5173" -TimeoutSec 2 -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            $frontendReady = $true
        }
    } catch {}
    
    if ($backendReady -and $frontendReady) {
        break
    }
    Start-Sleep -Seconds 2
}

# Display status
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  PitSynapse Status" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

if ($backendReady) {
    Write-Host "  [OK] Backend:  http://localhost:8000" -ForegroundColor Green
    Write-Host "  [OK] API Docs: http://localhost:8000/docs" -ForegroundColor Gray
} else {
    Write-Host "  [WAIT] Backend:  Starting... (check new window)" -ForegroundColor Yellow
    Write-Host "         URL: http://localhost:8000" -ForegroundColor Gray
}

if ($frontendReady) {
    Write-Host "  [OK] Frontend: http://localhost:5173" -ForegroundColor Green
} else {
    Write-Host "  [WAIT] Frontend: Starting... (check new window)" -ForegroundColor Yellow
    Write-Host "         URL: http://localhost:5173" -ForegroundColor Gray
}

Write-Host ""
Write-Host "  Opening browser..." -ForegroundColor Cyan
Start-Sleep -Seconds 2

# Open browser
try {
    Start-Process "http://localhost:5173"
} catch {
    Write-Host "  [WARN] Could not open browser automatically" -ForegroundColor Yellow
    Write-Host "         Please open: http://localhost:5173" -ForegroundColor Gray
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Servers are running in separate windows" -ForegroundColor Cyan
Write-Host "  Close those windows to stop the servers" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Enter to close this window..."
Read-Host
