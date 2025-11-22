@echo off
REM Task Manager API Testing Script
REM This script tests all endpoints of the Task Manager API

setlocal enabledelayedexpansion
set API_URL=http://localhost:3000

echo.
echo ========================================
echo    Task Manager API Test Suite
echo ========================================
echo.

REM Test 1: GET /tasks - Retrieve all tasks
echo [TEST 1] GET /tasks - Retrieve all tasks
echo.
powershell -Command "(Invoke-WebRequest -Uri '%API_URL%/tasks' -Method Get -ContentType 'application/json' -UseBasicParsing).Content | ConvertFrom-Json | ConvertTo-Json"
echo.
echo ========================================
echo.

REM Test 2: GET /tasks/1 - Retrieve a specific task
echo [TEST 2] GET /tasks/1 - Retrieve task with ID 1
echo.
powershell -Command "(Invoke-WebRequest -Uri '%API_URL%/tasks/1' -Method Get -ContentType 'application/json' -UseBasicParsing).Content | ConvertFrom-Json | ConvertTo-Json"
echo.
echo ========================================
echo.

REM Test 3: POST /tasks - Create a new task
echo [TEST 3] POST /tasks - Create a new task
echo.
powershell -Command "$body = @{title='Test Task';description='This is a test task';completed=$false} | ConvertTo-Json; (Invoke-WebRequest -Uri '%API_URL%/tasks' -Method Post -ContentType 'application/json' -Body $body -UseBasicParsing).Content | ConvertFrom-Json | ConvertTo-Json"
echo.
echo ========================================
echo.

REM Test 4: PUT /tasks/1 - Update task
echo [TEST 4] PUT /tasks/1 - Update task with ID 1
echo.
powershell -Command "$body = @{title='Updated Task';completed=$true} | ConvertTo-Json; (Invoke-WebRequest -Uri '%API_URL%/tasks/1' -Method Put -ContentType 'application/json' -Body $body -UseBasicParsing).Content | ConvertFrom-Json | ConvertTo-Json"
echo.
echo ========================================
echo.

REM Test 5: DELETE /tasks/99 - Delete non-existent task (should fail)
echo [TEST 5] DELETE /tasks/99 - Delete task that doesn't exist (Expected: 404)
echo.
powershell -Command "try { (Invoke-WebRequest -Uri '%API_URL%/tasks/99' -Method Delete -ContentType 'application/json' -UseBasicParsing).Content | ConvertFrom-Json | ConvertTo-Json } catch { if ($_.Exception.Response) { $_.Exception.Response.StatusCode; $_.ErrorDetails.Message } }"
echo.
echo ========================================
echo.

REM Test 6: GET /tasks - Verify all tasks after operations
echo [TEST 6] GET /tasks - Verify all tasks after operations
echo.
powershell -Command "(Invoke-WebRequest -Uri '%API_URL%/tasks' -Method Get -ContentType 'application/json' -UseBasicParsing).Content | ConvertFrom-Json | ConvertTo-Json"
echo.
echo ========================================
echo Test Suite Complete!
echo ========================================
pause
