@echo off
setlocal
cd /d "%~dp0"
set PYTHONPATH=%cd%

set PYTHON_CMD=C:\Users\DELL\AppData\Local\Python\bin\python.exe
if not exist "%PYTHON_CMD%" (
    set PYTHON_CMD=python
)

echo =================================================
echo        Starting Relay Orchestrator System        
echo =================================================

echo [1/2] Starting Mock External World on port 9210...
start "Relay Mock World (Port 9210)" "%PYTHON_CMD%" scripts\mock_world.py --port 9210

echo [2/2] Starting Relay Application on port 8080...
start "Relay App (Port 8080)" "%PYTHON_CMD%" -m uvicorn relay_app.main:app --host 127.0.0.1 --port 8080 --reload

timeout /t 2 /nobreak >nul

echo =================================================
echo         Relay Services Successfully Started!     
echo =================================================
echo Web Console:   http://localhost:8080/
echo Interactive:   http://localhost:8080/console
echo API Docs:      http://localhost:8080/docs
echo Mock World:    http://localhost:9210/
echo =================================================

start http://localhost:8080/
pause
