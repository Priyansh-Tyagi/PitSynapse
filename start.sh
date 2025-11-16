#!/bin/bash
# PitSynapse - Simple Startup Script
# Run from: ~/Downloads/PitSynapse/PitSynapse

cd PitSynapse/backend
python -m pip install -q -r requirements.txt
start "Backend" bash -c "python -m uvicorn main:app --host 0.0.0.0 --port 8000; read"

cd ../frontend
npm install --silent
start "Frontend" bash -c "npm run dev; read"

sleep 5
start http://localhost:5173

echo "Servers starting! Check the new windows."
