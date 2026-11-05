# Start script for Relay Orchestrator & Mock World
$ErrorActionPreference = "Stop"

# Auto-detect Python binary
$pythonPath = "C:\Users\DELL\AppData\Local\Python\bin\python.exe"
if (-not (Test-Path $pythonPath)) {
    $cmd = Get-Command python -ErrorAction SilentlyContinue
    if ($cmd) {
        $pythonPath = $cmd.Source
    } else {
        $pythonPath = "python"
    }
}

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir
$env:PYTHONPATH = $scriptDir

Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "       Starting Relay Orchestrator System        " -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "Using Python: $pythonPath" -ForegroundColor DarkGray

# 1. Start Mock World (Port 9210)
Write-Host "[1/2] Starting Mock External World on port 9210..." -ForegroundColor Yellow
$mockProcess = Start-Process -FilePath $pythonPath -ArgumentList "scripts\mock_world.py --port 9210" -PassThru -WindowStyle Normal

# 2. Start Relay Server & Background Worker (Port 8080)
Write-Host "[2/2] Starting Relay Application & Web Console on port 8080..." -ForegroundColor Yellow
$relayProcess = Start-Process -FilePath $pythonPath -ArgumentList "-m uvicorn relay_app.main:app --host 127.0.0.1 --port 8080 --reload" -PassThru -WindowStyle Normal

Start-Sleep -Seconds 2

Write-Host ""
Write-Host "=================================================" -ForegroundColor Green
Write-Host "        Relay Services Successfully Started!     " -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green
Write-Host "  Web Console:   http://localhost:8080/" -ForegroundColor Cyan
Write-Host "  Interactive:   http://localhost:8080/console" -ForegroundColor Cyan
Write-Host "  API Docs:      http://localhost:8080/docs" -ForegroundColor Cyan
Write-Host "  Mock World:    http://localhost:9210/" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Green
Write-Host "Press Ctrl+C or close the opened windows to stop." -ForegroundColor Gray

# Open browser
Start-Process "http://localhost:8080/"
