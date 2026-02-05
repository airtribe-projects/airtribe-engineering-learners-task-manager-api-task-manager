# Task Manager API

A simple RESTful API built using Node.js and Express.js to manage tasks using in-memory storage.

## Features
- Create, Read, Update, Delete tasks
- Input validation
- Proper error handling
- Fully tested with Tap & Supertest

## Setup
```bash
npm install
npm run test

A RESTful Task Manager API built using Node.js and Express.js, designed to manage tasks with features such as input validation, error handling, environment configuration, filtering, sorting, and priority support.
This project follows industry-standard backend practices and is structured for scalability and maintainability.

🚀 Features
Create, Read, Update, and Delete (CRUD) tasks
Input validation for request payloads
Centralized error handling
Environment variable configuration using .env
Logging with Morgan
Clean project structure generated using Express Generator
Test-ready setup

🛠️ Tech Stack

Node.js (v18+)
Express.js
Morgan (HTTP request logging)
dotenv (Environment configuration)
nodemon (Development)

📁 Project Structure
task-manager-api/
│
├── app.js
├── bin/
│   └── www
├── routes/
│   ├── index.js
│   ├── users.js
│   └── tasks.js
├── test/
│   └── server.test.js
├── .env
├── package.json
└── README.md

⚙️ Installation & Setup
1️⃣ Clone the Repository
git clone <repository-url>
cd task-manager-api

2️⃣ Install Dependencies
npm install

3️⃣ Environment Configuration
Create a .env file in the root directory:

PORT=3000
NODE_ENV=development
## (Refer .env.example for guidance)

▶️ Running the Application
Development Mode
npm run dev

Production Mode
npm start

🧪 Running Tests
npm run test

📌 API Endpoints
Create a Task

POST /tasks
{
  "title": "Install Node.js",
  "description": "Set up Node environment",
  "completed": false,
  "priority": "high"
}

Get All Tasks
GET /tasks
Optional Query Parameters:
#completed=true|false
#sortBy=createdAt:desc
#priority=high|medium|low

Update a Task
PUT /tasks/:id
Delete a Task
DELETE /tasks/:id

✅ Input Validation
Title is required
Completed must be boolean
Priority accepts only predefined values
Invalid inputs return 400 Bad Request

⚠️ Error Handling
Centralized error middleware
Proper HTTP status codes
Meaningful error messages
Handles invalid routes and server errors gracefully

🔐 Security & Best Practices
Environment variables for sensitive data
Ready for JWT-based authentication
Clean separation of routes, models, and middleware
Scalable structure for future enhancements

🌱 Optional Enhancements Implemented
Filtering tasks by status
Sorting tasks dynamically
Priority-based task handling
