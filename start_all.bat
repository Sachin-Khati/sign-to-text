@echo off
cd /d "%~dp0"
echo ========================================
echo Starting AI Sign Language Detector
echo ========================================
echo.
echo Make sure you have installed all dependencies:
echo   1. pip install -r requirements.txt
echo   2. cd backend ^&^& npm install
echo   3. cd frontend ^&^& npm install
echo.
echo Starting services...
echo.
echo Starting Python Service (port 5000)...
start "Python Service - Port 5000" cmd /k "cd /d %~dp0backend\python_service && python app.py"
timeout /t 3 /nobreak >nul

echo Starting Node.js Backend (port 4000)...
start "Node.js Backend - Port 4000" cmd /k "cd /d %~dp0backend && npm start"
timeout /t 3 /nobreak >nul

echo Starting Frontend (port 5173)...
start "Frontend - Port 5173" cmd /k "cd /d %~dp0frontend && npm run dev"
timeout /t 2 /nobreak >nul

echo.
echo ========================================
echo All services started!
echo ========================================
echo.
echo IMPORTANT: Open your browser and go to:
echo.
echo    🌐 http://localhost:5173
echo.
echo Python Service: http://localhost:5000
echo Node.js Backend: http://localhost:4000
echo Frontend (MAIN): http://localhost:5173 ⭐
echo.
echo Keep all three windows open!
echo.
pause

