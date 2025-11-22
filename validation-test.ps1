#!/usr/bin/env pwsh
# Task Manager API - Validation & Error Handling Test Script (PowerShell)
# Tests all validation rules and error scenarios using curl/Invoke-WebRequest

Write-Host "`n"
Write-Host "╔════════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  TASK MANAGER API - VALIDATION & ERROR HANDLING TEST SUITE        ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

$apiUrl = "http://localhost:3000"
$passed = 0
$failed = 0

function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Method,
        [string]$Endpoint,
        [object]$Body,
        [int]$ExpectedStatus,
        [string]$ExpectedMessage
    )
    
    $url = "$apiUrl$Endpoint"
    $testPassed = $false
    
    try {
        if ($Method -eq "GET") {
            $response = Invoke-WebRequest -Uri $url -Method Get -UseBasicParsing -ErrorAction SilentlyContinue
        } elseif ($Method -eq "DELETE") {
            $response = Invoke-WebRequest -Uri $url -Method Delete -UseBasicParsing -ErrorAction SilentlyContinue
        } else {
            $bodyJson = $Body | ConvertTo-Json -Depth 10
            $response = Invoke-WebRequest -Uri $url -Method $Method -ContentType "application/json" `
                -Body $bodyJson -UseBasicParsing -ErrorAction SilentlyContinue
        }
        
        $statusCode = $response.StatusCode
        $content = $response.Content | ConvertFrom-Json
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        $content = $_.ErrorDetails.Message | ConvertFrom-Json
    }
    
    if ($statusCode -eq $ExpectedStatus) {
        if ($ExpectedMessage) {
            if ($content.message -and $content.message -like "*$ExpectedMessage*") {
                $testPassed = $true
            }
        } else {
            $testPassed = $true
        }
    }
    
    if ($testPassed) {
        Write-Host "✅ PASS: $Name" -ForegroundColor Green
        return $true
    } else {
        Write-Host "❌ FAIL: $Name" -ForegroundColor Red
        Write-Host "   Expected Status: $ExpectedStatus, Got: $statusCode"
        if ($ExpectedMessage) {
            Write-Host "   Expected Message: '$ExpectedMessage'"
            Write-Host "   Got Message: '$($content.message)'"
        }
        return $false
    }
}

# ===== SUCCESSFUL REQUESTS =====
Write-Host "`n📌 SUCCESSFUL REQUESTS" -ForegroundColor Yellow
if (Test-Endpoint -Name "Create task - Valid request" -Method POST -Endpoint "/tasks" `
    -Body @{title="Valid Task"; description="This is valid"; completed=$false} -ExpectedStatus 201) {
    $passed++
} else {
    $failed++
}

# ===== TITLE VALIDATION TESTS =====
Write-Host "`n📌 TITLE VALIDATION TESTS" -ForegroundColor Yellow

if (Test-Endpoint -Name "Create task - Empty title" -Method POST -Endpoint "/tasks" `
    -Body @{title=""; description="Description"; completed=$false} -ExpectedStatus 400 -ExpectedMessage "Title is required") {
    $passed++
} else {
    $failed++
}

if (Test-Endpoint -Name "Create task - Null/Missing title" -Method POST -Endpoint "/tasks" `
    -Body @{description="Description"; completed=$false} -ExpectedStatus 400 -ExpectedMessage "Title is required") {
    $passed++
} else {
    $failed++
}

if (Test-Endpoint -Name "Create task - Whitespace only title" -Method POST -Endpoint "/tasks" `
    -Body @{title="   "; description="Description"; completed=$false} -ExpectedStatus 400 -ExpectedMessage "Title is required") {
    $passed++
} else {
    $failed++
}

# ===== DESCRIPTION VALIDATION TESTS =====
Write-Host "`n📌 DESCRIPTION VALIDATION TESTS" -ForegroundColor Yellow

if (Test-Endpoint -Name "Create task - Missing description" -Method POST -Endpoint "/tasks" `
    -Body @{title="Task"; completed=$false} -ExpectedStatus 400 -ExpectedMessage "Description is required") {
    $passed++
} else {
    $failed++
}

if (Test-Endpoint -Name "Create task - Null description" -Method POST -Endpoint "/tasks" `
    -Body @{title="Task"; description=$null; completed=$false} -ExpectedStatus 400 -ExpectedMessage "Description is required") {
    $passed++
} else {
    $failed++
}

# ===== COMPLETED FIELD VALIDATION TESTS =====
Write-Host "`n📌 COMPLETED FIELD VALIDATION TESTS" -ForegroundColor Yellow

if (Test-Endpoint -Name "Create task - completed is string 'true'" -Method POST -Endpoint "/tasks" `
    -Body @{title="Task"; description="Desc"; completed="true"} -ExpectedStatus 400 -ExpectedMessage "Completed must be a boolean") {
    $passed++
} else {
    $failed++
}

if (Test-Endpoint -Name "Create task - completed is number" -Method POST -Endpoint "/tasks" `
    -Body @{title="Task"; description="Desc"; completed=1} -ExpectedStatus 400 -ExpectedMessage "Completed must be a boolean") {
    $passed++
} else {
    $failed++
}

if (Test-Endpoint -Name "Create task - completed is null" -Method POST -Endpoint "/tasks" `
    -Body @{title="Task"; description="Desc"; completed=$null} -ExpectedStatus 400 -ExpectedMessage "Completed must be a boolean") {
    $passed++
} else {
    $failed++
}

if (Test-Endpoint -Name "Create task - completed missing" -Method POST -Endpoint "/tasks" `
    -Body @{title="Task"; description="Desc"} -ExpectedStatus 400 -ExpectedMessage "Completed must be a boolean") {
    $passed++
} else {
    $failed++
}

# ===== UPDATE VALIDATION TESTS =====
Write-Host "`n📌 UPDATE VALIDATION TESTS" -ForegroundColor Yellow

if (Test-Endpoint -Name "Update task - Empty title" -Method PUT -Endpoint "/tasks/1" `
    -Body @{title=""} -ExpectedStatus 400 -ExpectedMessage "Title cannot be empty") {
    $passed++
} else {
    $failed++
}

if (Test-Endpoint -Name "Update task - Invalid completed type" -Method PUT -Endpoint "/tasks/1" `
    -Body @{completed="false"} -ExpectedStatus 400 -ExpectedMessage "Completed must be a boolean") {
    $passed++
} else {
    $failed++
}

if (Test-Endpoint -Name "Update task - Valid partial update (only title)" -Method PUT -Endpoint "/tasks/1" `
    -Body @{title="Updated Title"} -ExpectedStatus 200) {
    $passed++
} else {
    $failed++
}

if (Test-Endpoint -Name "Update task - Valid partial update (only completed)" -Method PUT -Endpoint "/tasks/1" `
    -Body @{completed=$true} -ExpectedStatus 200) {
    $passed++
} else {
    $failed++
}

# ===== 404 ERROR TESTS =====
Write-Host "`n📌 404 ERROR TESTS" -ForegroundColor Yellow

if (Test-Endpoint -Name "Get task - Non-existent task ID" -Method GET -Endpoint "/tasks/99999" `
    -ExpectedStatus 404 -ExpectedMessage "Task not found") {
    $passed++
} else {
    $failed++
}

if (Test-Endpoint -Name "Update task - Non-existent task ID" -Method PUT -Endpoint "/tasks/99999" `
    -Body @{title="Updated"} -ExpectedStatus 404 -ExpectedMessage "Task not found") {
    $passed++
} else {
    $failed++
}

if (Test-Endpoint -Name "Delete task - Non-existent task ID" -Method DELETE -Endpoint "/tasks/99999" `
    -ExpectedStatus 404 -ExpectedMessage "Task not found") {
    $passed++
} else {
    $failed++
}

# Print results
Write-Host "`n"
Write-Host "╔════════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║ Test Results:" -ForegroundColor Cyan
Write-Host "║ ✅ PASSED: $passed" -ForegroundColor Green
Write-Host "║ ❌ FAILED: $failed" -ForegroundColor $(if ($failed -eq 0) { "Green" } else { "Red" })
Write-Host "╚════════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

if ($failed -eq 0) {
    Write-Host "🎉 ALL TESTS PASSED!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Some tests failed. Review the errors above." -ForegroundColor Yellow
}
