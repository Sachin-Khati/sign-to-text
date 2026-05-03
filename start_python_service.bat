@echo off
cd /d "%~dp0"
echo Starting Python Flask Service...
echo.
cd backend\python_service
python app.py
pause
