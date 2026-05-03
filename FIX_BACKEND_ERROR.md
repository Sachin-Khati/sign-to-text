# Fixing Backend Port Error

## Error: `EADDRINUSE: address already in use :::4000`

This error means **port 4000 is already in use**. This usually happens because:

### ✅ **Solution 1: The Backend is Already Running! (Most Common)**

If the backend is already running, you don't need to start it again! Just:
- Check if you already have a terminal with "Backend listening on http://localhost:4000"
- If yes, **that's fine!** Just continue with the frontend

### ✅ **Solution 2: Kill the Process Using Port 4000**

If you want to restart the backend, first kill the process using port 4000:

**Windows PowerShell:**
```powershell
# Find the process using port 4000
netstat -ano | findstr :4000

# Kill the process (replace 12372 with the PID you found)
taskkill /PID 12372 /F
```

Then start the backend again:
```bash
cd backend
npm start
```

### ✅ **Solution 3: Use a Different Port**

If you want to run multiple instances, change the port:

1. Create `backend/.env` file:
```
PORT=4001
```

2. Update `frontend/.env` (if exists) or update the API URL:
```
VITE_API_URL=http://localhost:4001
```

3. Restart both backend and frontend

### ✅ **Solution 4: Quick Fix Script**

Run this PowerShell command to kill any process on port 4000:
```powershell
$port = 4000
$process = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
if ($process) {
    $pid = $process.OwningProcess
    Stop-Process -Id $pid -Force
    Write-Host "Killed process $pid on port $port"
} else {
    Write-Host "No process found on port $port"
}
```

---

## Check if Backend is Already Running

Open your browser and go to:
- http://localhost:4000/api/health

If you see:
```json
{"status":"ok","time":"..."}
```

**Then your backend is already running!** You don't need to do anything.

---

## Summary

Most likely, your backend is **already running** from a previous start. Check your terminal windows - if one shows "Backend listening on http://localhost:4000", you're all set!

Just make sure:
1. ✅ Python service is running (port 5000)
2. ✅ Backend is running (port 4000) 
3. ✅ Frontend is running (port 5173)

Then go to **http://localhost:5173** in your browser!

