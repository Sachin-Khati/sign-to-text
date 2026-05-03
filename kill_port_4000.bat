@echo off
echo Killing process on port 4000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :4000 ^| findstr LISTENING') do (
    echo Found process %%a
    taskkill /PID %%a /F
    echo Process killed!
)
echo Done!
pause

