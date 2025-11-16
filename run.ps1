# One-line PowerShell runner
cd PitSynapse/backend; Start-Process powershell -ArgumentList "-NoExit", "-Command", "python -m uvicorn main:app --port 8000"; Start-Sleep 2; cd ../frontend; Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev"; Start-Sleep 3; Start-Process http://localhost:5173; Write-Host "Servers starting! Check the new windows."
