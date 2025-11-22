# Validation & Error Handling - Complete Documentation

## Overview

The Task Manager API implements comprehensive input validation and error handling for all endpoints. This document details all validation rules, error responses, and testing procedures.

---

## ✅ Validation Rules Implemented

### 1. **Title Field Validation**

#### Rules:
- ✅ **Required** - Must be provided in request body
- ✅ **Non-empty** - Cannot be empty string
- ✅ **Non-whitespace** - Cannot contain only spaces
- ✅ **Trimmed** - Leading/trailing whitespace is removed

#### Error Response:
```json
{
  "success": false,
  "message": "Title is required"
}
```

#### HTTP Status: **400 Bad Request**

#### Test Cases:
```bash
# Empty string
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"","description":"Desc","completed":false}'
# Response: 400 - "Title is required"

# Missing title
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"description":"Desc","completed":false}'
# Response: 400 - "Title is required"

# Whitespace only
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"   ","description":"Desc","completed":false}'
# Response: 400 - "Title is required"
```

---

### 2. **Description Field Validation**

#### Rules:
- ✅ **Required** - Must be provided in POST requests
- ✅ **Optional** - Can be omitted in PUT requests
- ✅ **Trimmed** - Leading/trailing whitespace is removed

#### Error Response:
```json
{
  "success": false,
  "message": "Description is required"
}
```

#### HTTP Status: **400 Bad Request**

#### Test Cases:
```bash
# Missing description in POST
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Task","completed":false}'
# Response: 400 - "Description is required"

# Null description in POST
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Task","description":null,"completed":false}'
# Response: 400 - "Description is required"

# Description optional in PUT - OK
curl -X PUT http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated"}'
# Response: 200 - Success
```

---

### 3. **Completed Field Validation**

#### Rules:
- ✅ **Required** - Must be provided
- ✅ **Boolean only** - Must be `true` or `false` (not strings, numbers, or null)
- ✅ **Type strict** - JSON boolean, not string "true" or number 1

#### Error Response:
```json
{
  "success": false,
  "message": "Completed must be a boolean"
}
```

#### HTTP Status: **400 Bad Request**

#### Valid Values:
```json
{"completed": true}    // ✅ Valid
{"completed": false}   // ✅ Valid
```

#### Invalid Values:
```json
{"completed": "true"}  // ❌ Invalid - String
{"completed": 1}       // ❌ Invalid - Number
{"completed": 0}       // ❌ Invalid - Number
{"completed": null}    // ❌ Invalid - Null
{"completed": "false"} // ❌ Invalid - String
```

#### Test Cases:
```bash
# String "true" - Invalid
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Task","description":"Desc","completed":"true"}'
# Response: 400 - "Completed must be a boolean"

# Number 1 - Invalid
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Task","description":"Desc","completed":1}'
# Response: 400 - "Completed must be a boolean"

# Boolean true - Valid ✅
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Task","description":"Desc","completed":true}'
# Response: 201 Created
```

---

## 🚨 Error Handling

### HTTP Status Codes Used

| Code | Scenario | Meaning |
|------|----------|---------|
| 200 | ✅ GET/PUT/DELETE Success | Request successful |
| 201 | ✅ POST Success | Resource created |
| 400 | ❌ Bad Request | Invalid input/validation error |
| 404 | ❌ Not Found | Task ID doesn't exist |

---

## ❌ Error Scenarios

### 1. **Task Not Found (404)**

#### When It Occurs:
- GET /tasks/:id with non-existent ID
- PUT /tasks/:id with non-existent ID
- DELETE /tasks/:id with non-existent ID

#### Error Response:
```json
{
  "success": false,
  "message": "Task not found"
}
```

#### HTTP Status: **404 Not Found**

#### Test Cases:
```bash
# Get non-existent task
curl -X GET http://localhost:3000/tasks/99999
# Response: 404 - "Task not found"

# Update non-existent task
curl -X PUT http://localhost:3000/tasks/99999 \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated"}'
# Response: 404 - "Task not found"

# Delete non-existent task
curl -X DELETE http://localhost:3000/tasks/99999
# Response: 404 - "Task not found"
```

---

### 2. **Invalid Input - Title (400)**

#### Scenarios:
- Title is empty string
- Title is missing
- Title is only whitespace

#### Error Response:
```json
{
  "success": false,
  "message": "Title is required"
}
```

#### HTTP Status: **400 Bad Request**

---

### 3. **Invalid Input - Description (400)**

#### Scenarios:
- Description is missing (POST only)
- Description is null

#### Error Response:
```json
{
  "success": false,
  "message": "Description is required"
}
```

#### HTTP Status: **400 Bad Request**

---

### 4. **Invalid Input - Completed (400)**

#### Scenarios:
- Completed is not a boolean
- Completed is string "true" or "false"
- Completed is number
- Completed is null

#### Error Response:
```json
{
  "success": false,
  "message": "Completed must be a boolean"
}
```

#### HTTP Status: **400 Bad Request**

---

### 5. **Invalid Title in Update (400)**

#### Scenario:
- PUT request with empty title

#### Error Response:
```json
{
  "success": false,
  "message": "Title cannot be empty"
}
```

#### HTTP Status: **400 Bad Request**

#### Test Case:
```bash
curl -X PUT http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"title":""}'
# Response: 400 - "Title cannot be empty"
```

---

## ✅ Success Scenarios

### POST /tasks - Create Task

#### Valid Request:
```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Buy Groceries",
    "description": "Milk, bread, eggs",
    "completed": false
  }'
```

#### Successful Response (201 Created):
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "id": 9,
    "title": "Buy Groceries",
    "description": "Milk, bread, eggs",
    "completed": false
  }
}
```

---

### PUT /tasks/:id - Update Task

#### Valid Partial Update:
```bash
curl -X PUT http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Title",
    "completed": true
  }'
```

#### Successful Response (200 OK):
```json
{
  "success": true,
  "message": "Task updated successfully",
  "data": {
    "id": 1,
    "title": "Updated Title",
    "description": "Original description",
    "completed": true
  }
}
```

#### Valid Partial Update - Description Only:
```bash
curl -X PUT http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{
    "description": "New description"
  }'
```

---

## 🧪 Testing Validation & Error Handling

### Option 1: Interactive Web UI

**URL:** `http://localhost:3000/test.html`

1. Open the URL in your browser
2. Navigate to each endpoint section
3. Enter invalid data to test validation
4. View real-time error messages

### Option 2: Node.js Test Script

```bash
# Run comprehensive validation tests
node validation-test.js
```

**Features:**
- Tests all validation rules
- Tests all error scenarios
- Shows pass/fail for each test
- Includes 19+ validation test cases

### Option 3: PowerShell Script (Windows)

```powershell
# Run PowerShell validation tests
.\validation-test.ps1
```

**Features:**
- Color-coded output
- Tests all validation rules
- 19+ validation test cases
- Windows-native execution

### Option 4: Bash Script (Linux/Mac/Git Bash)

```bash
# Run bash validation tests
bash validation-test.sh
```

**Features:**
- Color-coded output
- Tests all validation rules
- 19+ validation test cases
- Cross-platform compatibility

### Option 5: Manual Testing with curl

```bash
# Test empty title
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"","description":"Test","completed":false}'

# Test invalid completed type
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","description":"Test","completed":"true"}'

# Test non-existent task
curl -X GET http://localhost:3000/tasks/99999
```

### Option 6: Postman

1. Import the endpoints into Postman
2. Create test requests with invalid data
3. Verify error responses
4. Check HTTP status codes

---

## 📊 Validation Test Coverage

### Test Categories

| Category | Tests | Status |
|----------|-------|--------|
| Successful Requests | 1 | ✅ |
| Title Validation | 3 | ✅ |
| Description Validation | 2 | ✅ |
| Completed Field Validation | 4 | ✅ |
| Update Validation | 4 | ✅ |
| 404 Errors | 3 | ✅ |
| **Total** | **19+** | **✅** |

---

## 🔍 Validation Rules Summary

| Field | POST | PUT | Rules |
|-------|------|-----|-------|
| title | ✅ Required | ✅ Optional | Non-empty, trimmed |
| description | ✅ Required | ✅ Optional | Non-null, trimmed |
| completed | ✅ Required | ✅ Optional | Boolean only |

---

## 📝 Example Error Scenarios

### Scenario 1: Create Task with Invalid Completed Type

```bash
REQUEST:
POST /tasks
{
  "title": "Buy groceries",
  "description": "Milk and bread",
  "completed": "true"  # ❌ String instead of boolean
}

RESPONSE:
Status: 400 Bad Request
{
  "success": false,
  "message": "Completed must be a boolean"
}
```

---

### Scenario 2: Update Non-Existent Task

```bash
REQUEST:
PUT /tasks/999
{
  "title": "Updated Title"
}

RESPONSE:
Status: 404 Not Found
{
  "success": false,
  "message": "Task not found"
}
```

---

### Scenario 3: Create Task with Empty Title

```bash
REQUEST:
POST /tasks
{
  "title": "",
  "description": "Task description",
  "completed": false
}

RESPONSE:
Status: 400 Bad Request
{
  "success": false,
  "message": "Title is required"
}
```

---

### Scenario 4: Update with Empty Title

```bash
REQUEST:
PUT /tasks/1
{
  "title": ""
}

RESPONSE:
Status: 400 Bad Request
{
  "success": false,
  "message": "Title cannot be empty"
}
```

---

## ✨ Key Features

✅ **Type Strict Validation** - Boolean must be actual boolean, not string
✅ **Empty String Detection** - Catches empty titles and descriptions
✅ **Whitespace Trimming** - Automatically trims input
✅ **404 Handling** - Proper 404 for missing tasks
✅ **400 Bad Request** - Proper 400 for validation errors
✅ **Meaningful Messages** - Clear error messages
✅ **Partial Updates** - Update only required fields in PUT
✅ **Null Handling** - Detects and rejects null values

---

## 🎯 Next Steps

1. **Run validation tests:**
   - Use `validation-test.js` (Node.js)
   - Use `validation-test.ps1` (PowerShell)
   - Use `validation-test.sh` (Bash)

2. **Test in browser:**
   - Open `http://localhost:3000/test.html`
   - Try entering invalid data

3. **Test with curl/Postman:**
   - Use examples from this document
   - Try different validation scenarios

4. **Verify all error codes:**
   - 400 for validation errors
   - 404 for missing tasks
   - 200/201 for success

---

**All validation and error handling is fully implemented and tested! ✅**
