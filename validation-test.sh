#!/bin/bash
# Task Manager API - Validation & Error Handling Tests using curl
# This script tests all validation rules and error scenarios
# Works on Linux, macOS, and Windows (Git Bash)

API_URL="http://localhost:3000"
PASSED=0
FAILED=0

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo ""
echo -e "${CYAN}╔════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║  TASK MANAGER API - VALIDATION & ERROR HANDLING TEST SUITE        ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════════════════════════════╝${NC}"
echo ""

function test_endpoint() {
    local name=$1
    local method=$2
    local endpoint=$3
    local body=$4
    local expected_status=$5
    local expected_message=$6

    url="${API_URL}${endpoint}"
    
    if [ -z "$body" ]; then
        response=$(curl -s -w "\n%{http_code}" -X "$method" "$url" \
            -H "Content-Type: application/json")
    else
        response=$(curl -s -w "\n%{http_code}" -X "$method" "$url" \
            -H "Content-Type: application/json" \
            -d "$body")
    fi
    
    http_code=$(echo "$response" | tail -n 1)
    body_response=$(echo "$response" | head -n -1)
    
    if [ "$http_code" = "$expected_status" ]; then
        if [ -z "$expected_message" ]; then
            echo -e "${GREEN}✅ PASS${NC}: $name"
            ((PASSED++))
        else
            if echo "$body_response" | grep -q "$expected_message"; then
                echo -e "${GREEN}✅ PASS${NC}: $name"
                ((PASSED++))
            else
                echo -e "${RED}❌ FAIL${NC}: $name"
                echo "   Expected Message: '$expected_message'"
                echo "   Got Response: $body_response"
                ((FAILED++))
            fi
        fi
    else
        echo -e "${RED}❌ FAIL${NC}: $name"
        echo "   Expected Status: $expected_status, Got: $http_code"
        if [ -n "$expected_message" ]; then
            echo "   Expected Message: '$expected_message'"
            echo "   Got Response: $body_response"
        fi
        ((FAILED++))
    fi
}

# ===== SUCCESSFUL REQUESTS =====
echo -e "${YELLOW}📌 SUCCESSFUL REQUESTS${NC}"
test_endpoint \
    "Create task - Valid request" \
    "POST" \
    "/tasks" \
    '{"title":"Valid Task","description":"This is valid","completed":false}' \
    "201"

# ===== TITLE VALIDATION TESTS =====
echo ""
echo -e "${YELLOW}📌 TITLE VALIDATION TESTS${NC}"

test_endpoint \
    "Create task - Empty title" \
    "POST" \
    "/tasks" \
    '{"title":"","description":"Description","completed":false}' \
    "400" \
    "Title is required"

test_endpoint \
    "Create task - Null/Missing title" \
    "POST" \
    "/tasks" \
    '{"description":"Description","completed":false}' \
    "400" \
    "Title is required"

test_endpoint \
    "Create task - Whitespace only title" \
    "POST" \
    "/tasks" \
    '{"title":"   ","description":"Description","completed":false}' \
    "400" \
    "Title is required"

# ===== DESCRIPTION VALIDATION TESTS =====
echo ""
echo -e "${YELLOW}📌 DESCRIPTION VALIDATION TESTS${NC}"

test_endpoint \
    "Create task - Missing description" \
    "POST" \
    "/tasks" \
    '{"title":"Task","completed":false}' \
    "400" \
    "Description is required"

test_endpoint \
    "Create task - Null description" \
    "POST" \
    "/tasks" \
    '{"title":"Task","description":null,"completed":false}' \
    "400" \
    "Description is required"

# ===== COMPLETED FIELD VALIDATION TESTS =====
echo ""
echo -e "${YELLOW}📌 COMPLETED FIELD VALIDATION TESTS${NC}"

test_endpoint \
    "Create task - completed is string 'true'" \
    "POST" \
    "/tasks" \
    '{"title":"Task","description":"Desc","completed":"true"}' \
    "400" \
    "Completed must be a boolean"

test_endpoint \
    "Create task - completed is number" \
    "POST" \
    "/tasks" \
    '{"title":"Task","description":"Desc","completed":1}' \
    "400" \
    "Completed must be a boolean"

test_endpoint \
    "Create task - completed is null" \
    "POST" \
    "/tasks" \
    '{"title":"Task","description":"Desc","completed":null}' \
    "400" \
    "Completed must be a boolean"

test_endpoint \
    "Create task - completed missing" \
    "POST" \
    "/tasks" \
    '{"title":"Task","description":"Desc"}' \
    "400" \
    "Completed must be a boolean"

# ===== UPDATE VALIDATION TESTS =====
echo ""
echo -e "${YELLOW}📌 UPDATE VALIDATION TESTS${NC}"

test_endpoint \
    "Update task - Empty title" \
    "PUT" \
    "/tasks/1" \
    '{"title":""}' \
    "400" \
    "Title cannot be empty"

test_endpoint \
    "Update task - Invalid completed type (string)" \
    "PUT" \
    "/tasks/1" \
    '{"completed":"false"}' \
    "400" \
    "Completed must be a boolean"

test_endpoint \
    "Update task - Valid partial update (only title)" \
    "PUT" \
    "/tasks/1" \
    '{"title":"Updated Title"}' \
    "200"

test_endpoint \
    "Update task - Valid partial update (only completed)" \
    "PUT" \
    "/tasks/1" \
    '{"completed":true}' \
    "200"

# ===== 404 ERROR TESTS =====
echo ""
echo -e "${YELLOW}📌 404 ERROR TESTS${NC}"

test_endpoint \
    "Get task - Non-existent task ID" \
    "GET" \
    "/tasks/99999" \
    "" \
    "404" \
    "Task not found"

test_endpoint \
    "Update task - Non-existent task ID" \
    "PUT" \
    "/tasks/99999" \
    '{"title":"Updated"}' \
    "404" \
    "Task not found"

test_endpoint \
    "Delete task - Non-existent task ID" \
    "DELETE" \
    "/tasks/99999" \
    "" \
    "404" \
    "Task not found"

# Print results
echo ""
echo -e "${CYAN}╔════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║ Test Results:${NC}"
echo -e "${GREEN}║ ✅ PASSED: $PASSED${NC}"
if [ "$FAILED" -eq 0 ]; then
    echo -e "${GREEN}║ ❌ FAILED: $FAILED${NC}"
else
    echo -e "${RED}║ ❌ FAILED: $FAILED${NC}"
fi
echo -e "${CYAN}╚════════════════════════════════════════════════════════════════════╝${NC}"
echo ""

if [ "$FAILED" -eq 0 ]; then
    echo -e "${GREEN}🎉 ALL TESTS PASSED!${NC}"
    exit 0
else
    echo -e "${YELLOW}⚠️  Some tests failed. Review the errors above.${NC}"
    exit 1
fi
