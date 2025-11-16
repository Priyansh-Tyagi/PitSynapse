# Fix PowerShell Execution Policy Error

If you get an error like:
```
.\start.ps1 : File cannot be loaded because running scripts is disabled on this system
```

## Quick Fix - Use One of These:

### Option 1: Use run.ps1 (Easiest)
```powershell
.\run.ps1
```

### Option 2: Bypass Execution Policy
```powershell
powershell -ExecutionPolicy Bypass -File .\start.ps1
```

### Option 3: Use start.bat Instead
Just double-click `start.bat` - it doesn't have execution policy issues!

### Option 4: Change Execution Policy (Permanent)
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```
Then run: `.\start.ps1`

---

## Recommended: Just Use start.bat

The easiest solution is to **just use start.bat**:
- Double-click `start.bat` in File Explorer
- Or run: `start.bat` in Command Prompt

No PowerShell execution policy issues!

