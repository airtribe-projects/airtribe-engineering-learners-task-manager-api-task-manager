# 📝 Task Manager Backend API

A robust RESTful API built with **Node.js** and **Express** for managing tasks. This project was developed as part of the Airtribe Backend Engineering Launchpad to demonstrate proficiency in building scalable CRUD applications.

---

## 🚀 Features
- **CRUD Operations**: Complete Create, Read, Update, and Delete functionality.
- **Data Persistence**: Lightweight storage using a local `task.json` file.
- **Input Validation**: Middleware to ensure data integrity (e.g., checking for required fields).
- **Error Handling**: Graceful error responses for missing resources or invalid requests.
- **Testing**: Fully automated test suite using **Jest** and **Supertest**.

---

## 🛠️ Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Testing**: Jest & Supertest
- **Storage**: JSON-based file system

---

## 📁 Project Structure
```text
.
├── routes/
│   └── route.js        # API route definitions and logic
├── test/
│   └── server.test.js  # Automated tests for API endpoints
├── app.js              # Main entry point (Express server setup)
├── task.json           # JSON database for storing tasks
├── package.json        # Project metadata and dependencies
├── .gitignore          # Git ignore rules
└── README.md           # Project documentation

🚦 API Endpoints
Method,Endpoint,Description,Request Body (JSON)
GET,/tasks,Retrieve all tasks,N/A
GET,/tasks/:id,Retrieve a specific task,N/A
POST,/tasks,Create a new task,"{ ""title"": ""str"", ""desc"": ""str"" }"
PUT,/tasks/:id,Update an existing task,"{ ""title"": ""str"", ""status"": ""bool"" }"
DELETE,/tasks/:id,Delete a task,N/A