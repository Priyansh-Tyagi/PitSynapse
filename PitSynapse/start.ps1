# PitSynapse - One-Command Startup Script
# Run this script to start everything: .\start.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  PitSynapse - Starting Everything..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Get the script directory
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir

# Check if Python is installed
Write-Host "[1/5] Checking Python..." -ForegroundColor Yellow
try {
    $pythonVersion = python --version 2>&1
    Write-Host "  ✓ Python found: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Python not found! Please install Python 3.8+" -ForegroundColor Red
    exit 1
}

# Check if Node.js is installed
Write-Host "[2/5] Checking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version 2>&1
    Write-Host "  ✓ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Node.js not found! Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Install Python dependencies
Write-Host "[3/5] Installing Python dependencies..." -ForegroundColor Yellow
Set-Location "$scriptDir\backend"
if (Test-Path "requirements.txt") {
    python -m pip install -q -r requirements.txt
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✓ Python dependencies installed" -ForegroundColor Green
    } else {
        Write-Host "  ⚠ Some packages may have failed to install" -ForegroundColor Yellow
    }
} else {
    Write-Host "  ⚠ requirements.txt not found, skipping..." -ForegroundColor Yellow
}
Set-Location $scriptDir

# Install Node.js dependencies
Write-Host "[4/5] Installing Node.js dependencies..." -ForegroundColor Yellow
Set-Location "$scriptDir\frontend"
if (Test-Path "package.json") {
    npm install --silent
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✓ Node.js dependencies installed" -ForegroundColor Green
    } else {
        Write-Host "  ⚠ Some packages may have failed to install" -ForegroundColor Yellow
    }
} else {
    Write-Host "  ⚠ package.json not found, skipping..." -ForegroundColor Yellow
}
Set-Location $scriptDir

# Start servers
Write-Host "[5/5] Starting servers..." -ForegroundColor Yellow
Write-Host ""

# Start backend in background
Write-Host "  Starting Backend Server..." -ForegroundColor Cyan
$backendJob = Start-Job -ScriptBlock {
    Set-Location $using:scriptDir
    Set-Location backend
    python -m uvicorn main:app --host 0.0.0.0 --port 8000
}

# Wait a bit for backend to start
Start-Sleep -Seconds 3

# Start frontend in background
Write-Host "  Starting Frontend Server..." -ForegroundColor Cyan
$frontendJob = Start-Job -ScriptBlock {
    Set-Location $using:scriptDir
    Set-Location frontend
    npm run dev
}

# Wait for servers to be ready
Write-Host ""
Write-Host "  Waiting for servers to start..." -ForegroundColor Yellow
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
Write-Host "  PitSynapse is Running!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

if ($backendReady) {
    Write-Host "  ✓ Backend:  http://localhost:8000" -ForegroundColor Green
    Write-Host "  ✓ API Docs: http://localhost:8000/docs" -ForegroundColor Gray
} else {
    Write-Host "  ⚠ Backend:  Starting... (check Terminal 1)" -ForegroundColor Yellow
}

if ($frontendReady) {
    Write-Host "  ✓ Frontend: http://localhost:5173" -ForegroundColor Green
} else {
    Write-Host "  ⚠ Frontend: Starting... (check Terminal 2)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "  Opening browser..." -ForegroundColor Cyan
Start-Sleep -Seconds 2

# Open browser
Start-Process "http://localhost:5173"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Servers are running in background" -ForegroundColor Cyan
Write-Host "  Press Ctrl+C to stop this script" -ForegroundColor Cyan
Write-Host "  (Servers will continue running)" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Keep script running and show job status
try {
    while ($true) {
        $backendStatus = Get-Job -Id $backendJob.Id | Select-Object -ExpandProperty State
        $frontendStatus = Get-Job -Id $frontendJob.Id | Select-Object -ExpandProperty State
        
        Write-Host "`rBackend: $backendStatus | Frontend: $frontendStatus" -NoNewline -ForegroundColor Gray
        Start-Sleep -Seconds 5
    }
} catch {
    Write-Host ""
    Write-Host "Stopping..." -ForegroundColor Yellow
    Stop-Job -Job $backendJob, $frontendJob -ErrorAction SilentlyContinue
    Remove-Job -Job $backendJob, $frontendJob -ErrorAction SilentlyContinue
}

