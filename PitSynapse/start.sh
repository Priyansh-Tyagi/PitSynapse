#!/bin/bash
# PitSynapse - One-Command Startup Script (Linux/Mac)
# Run: ./start.sh or bash start.sh

echo "========================================"
echo "  PitSynapse - Starting Everything..."
echo "========================================"
echo ""

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Check Python
echo "[1/5] Checking Python..."
if ! command -v python3 &> /dev/null; then
    echo "  [ERROR] Python 3 not found! Please install Python 3.8+"
    exit 1
fi
echo "  [OK] Python found: $(python3 --version)"
echo ""

# Check Node.js
echo "[2/5] Checking Node.js..."
if ! command -v node &> /dev/null; then
    echo "  [ERROR] Node.js not found! Please install Node.js"
    exit 1
fi
echo "  [OK] Node.js found: $(node --version)"
echo ""

# Install Python dependencies
echo "[3/5] Installing Python dependencies..."
cd "$SCRIPT_DIR/backend"
if [ -f "requirements.txt" ]; then
    pip3 install -q -r requirements.txt
    echo "  [OK] Python dependencies installed"
else
    echo "  [WARN] requirements.txt not found"
fi
cd "$SCRIPT_DIR"
echo ""

# Install Node.js dependencies
echo "[4/5] Installing Node.js dependencies..."
cd "$SCRIPT_DIR/frontend"
if [ -f "package.json" ]; then
    npm install --silent
    echo "  [OK] Node.js dependencies installed"
else
    echo "  [WARN] package.json not found"
fi
cd "$SCRIPT_DIR"
echo ""

# Start servers
echo "[5/5] Starting servers..."
echo ""

# Start backend in background
echo "  Starting Backend Server..."
cd "$SCRIPT_DIR/backend"
python3 -m uvicorn main:app --host 0.0.0.0 --port 8000 > ../backend.log 2>&1 &
BACKEND_PID=$!
cd "$SCRIPT_DIR"

# Wait a bit
sleep 3

# Start frontend in background
echo "  Starting Frontend Server..."
cd "$SCRIPT_DIR/frontend"
npm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!
cd "$SCRIPT_DIR"

# Wait for servers
echo ""
echo "  Waiting for servers to start..."
sleep 8

# Check servers
echo ""
echo "========================================"
echo "  PitSynapse is Running!"
echo "========================================"
echo ""
echo "  Backend:  http://localhost:8000"
echo "  Frontend: http://localhost:5173"
echo "  API Docs: http://localhost:8000/docs"
echo ""
echo "  Opening browser..."
sleep 2

# Open browser (Linux/Mac)
if command -v xdg-open &> /dev/null; then
    xdg-open http://localhost:5173
elif command -v open &> /dev/null; then
    open http://localhost:5173
fi

echo ""
echo "========================================"
echo "  Servers are running in background"
echo "  Backend PID: $BACKEND_PID"
echo "  Frontend PID: $FRONTEND_PID"
echo ""
echo "  To stop servers, run:"
echo "    kill $BACKEND_PID $FRONTEND_PID"
echo "========================================"
echo ""

# Keep script running
wait

