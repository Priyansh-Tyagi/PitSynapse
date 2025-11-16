# Fix Bash Script Errors

## Common Bash Errors & Fixes

### Error: "Permission denied"
**Fix:**
```bash
chmod +x start.sh
./start.sh
```

### Error: "command not found: python3"
**Fix:**
- Make sure Python is installed
- Try using `python` instead: Edit start.sh and change `python3` to `python`

### Error: "command not found: node"
**Fix:**
- Install Node.js from https://nodejs.org/
- Or use nvm: `nvm install node`

### Error: "No such file or directory: backend"
**Fix:**
- Make sure you're in the correct directory
- The script should auto-detect nested directories
- Run from: `PitSynapse/PitSynapse/` directory

### Error: "line X: syntax error"
**Fix:**
- Make sure you're using bash, not sh
- Run: `bash start.sh` instead of `sh start.sh`

## Alternative: Use Manual Commands

If the script doesn't work, use these commands:

### Terminal 1 (Backend):
```bash
cd PitSynapse/PitSynapse/backend
pip install -r requirements.txt
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```

### Terminal 2 (Frontend):
```bash
cd PitSynapse/PitSynapse/frontend
npm install
npm run dev
```

## Windows Git Bash

If using Git Bash on Windows:
1. Make sure Python and Node are in PATH
2. Use: `bash start.sh`
3. Or use `start.bat` instead (easier on Windows)

## Linux/Mac

```bash
chmod +x start.sh
./start.sh
```

## Troubleshooting

**Check Python:**
```bash
python3 --version
# or
python --version
```

**Check Node:**
```bash
node --version
npm --version
```

**Check directory:**
```bash
pwd
ls -la
```

**Test script syntax:**
```bash
bash -n start.sh
```

If no errors, the script syntax is correct!

