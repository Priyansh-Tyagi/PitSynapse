# Quick Fix: Bash Script Location

## The Problem
You're in the `backend` directory, but `start.sh` is in the parent directory.

## Solution 1: Navigate to Correct Directory

```bash
# Go up to the project root
cd ../..

# Then run
bash start.sh
```

## Solution 2: Run from Current Location

```bash
# From backend directory, go up and run
cd .. && bash start.sh
```

## Solution 3: Use Full Path

```bash
# From anywhere
bash ~/Downloads/PitSynapse/PitSynapse/PitSynapse/start.sh
```

## Solution 4: Use the Batch File (Windows)

If you're on Windows, just use:
```bash
start.bat
```

Or double-click `start.bat` in File Explorer.

## Correct Directory Structure

```
PitSynapse/PitSynapse/          ← start.sh is here
├── backend/                    ← You are here
├── frontend/
└── start.sh                    ← Run from parent directory
```

## Quick Command

From `backend` directory:
```bash
cd ../.. && bash start.sh
```

