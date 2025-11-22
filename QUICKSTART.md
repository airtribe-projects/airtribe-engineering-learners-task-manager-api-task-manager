# 🚀 Quick Start Guide - Task Manager API

## Current Status
✅ **Server is running on port 3000**
✅ **All endpoints implemented and working**
✅ **Interactive test interface available**

---

## 🎯 Start Testing Right Now!

### Method 1: Interactive Web UI (Easiest - Recommended ⭐)

1. **Open in Browser:**
   ```
   http://localhost:3000/test.html
   ```

2. **You'll see a beautiful interface with 5 sections:**
   - GET /tasks - Retrieve all tasks
   - GET /tasks/:id - Get specific task
   - POST /tasks - Create new task
   - PUT /tasks/:id - Update task
   - DELETE /tasks/:id - Delete task

3. **Fill in the fields and click "Run Test"**

4. **View the JSON response instantly**

---

## 📝 Quick Examples

### Using PowerShell

**Get all tasks:**
```powershell
Invoke-WebRequest http://localhost:3000/tasks -UseBasicParsing | Select-Object -ExpandProperty Content
```

**Create a task:**
```powershell
$body = '{"title":"Buy Groceries","description":"Milk, bread, eggs","completed":false}'
Invoke-WebRequest -Uri http://localhost:3000/tasks -Method Post -ContentType "application/json" -Body $body -UseBasicParsing
```

**Update a task:**
```powershell
$body = '{"completed":true}'
Invoke-WebRequest -Uri http://localhost:3000/tasks/1 -Method Put -ContentType "application/json" -Body $body -UseBasicParsing
```

**Delete a task:**
```powershell
Invoke-WebRequest -Uri http://localhost:3000/tasks/1 -Method Delete -UseBasicParsing
```

---

## 🔍 API Endpoints Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tasks` | Get all tasks |
| GET | `/tasks/:id` | Get task by ID |
| POST | `/tasks` | Create new task |
| PUT | `/tasks/:id` | Update task |
| DELETE | `/tasks/:id` | Delete task |

---

## 📊 Expected Response Format

### Success Response (GET /tasks)
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Task Title",
      "description": "Task Description",
      "completed": false
    }
  ]
}
```

### Error Response (Task Not Found)
```json
{
  "success": false,
  "message": "Task not found"
}
```

---

## ✅ Test Checklist

Use this to verify all endpoints are working:

- [ ] **GET /tasks** - Shows list of all tasks
- [ ] **GET /tasks/1** - Shows task with ID 1
- [ ] **POST /tasks** - Create new task and get ID
- [ ] **PUT /tasks/1** - Update task and confirm changes
- [ ] **DELETE /tasks/1** - Delete task (404 on retry)

---

## 🛠️ Troubleshooting

### Server won't start?
```powershell
# Kill any existing node processes
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

# Start fresh
cd "c:\Users\saran\OneDrive\Desktop\taskmanager API\task-manager-api-kknsrn"
node app.js
```

### Can't connect?
- Make sure server shows: `Server is listening on 3000`
- Try: `http://127.0.0.1:3000/test.html` instead
- Wait 2 seconds after starting server

### Port already in use?
```powershell
# Find process using port 3000
netstat -ano | findstr :3000
```

---

## 📚 Documentation Files

- **README.md** - Complete API documentation
- **IMPLEMENTATION_SUMMARY.md** - Full implementation details
- **app.js** - Source code with comments

---

## 🎓 Learn More

For detailed documentation, open:
```
README.md
```

---

## 💡 Pro Tips

1. **Use the web interface first** - It's the easiest way to understand the API
2. **Try invalid data** - See how the API validates input
3. **Check task.json** - See how data is persisted
4. **Use IDs that exist** - Check current tasks before updating/deleting

---

**Everything is ready! Open http://localhost:3000/test.html to start testing! 🎉**
