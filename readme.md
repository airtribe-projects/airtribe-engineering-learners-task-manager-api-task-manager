# Task Manager API with Authentication

A complete RESTful API for task management with JWT authentication, user preferences, and News API integration.

## Table of Contents
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Setup](#-setup)
- [API Documentation](#-api-documentation)
  - [Authentication](#-authentication)
  - [Users](#-users)
  - [Preferences](#-preferences)
  - [News](#-news)
  - [Tasks](#-tasks)

## 🎯 Features

- **User Registration & Authentication**
- **JWT Token-based Security**
- **Task CRUD Operations**
- **User Preference System**
- **Personalized News Feed**
- **Input Validation**
- **Password Hashing**

## 🛠️ Tech Stack

| Component       | Technology           |
|----------------|---------------------|
| Framework      | Express.js          |
| Authentication| JWT                 |
| Password Hashing | bcrypt           |
| HTTP Client   | Axios               |
| News Service  | NewsAPI             |

## 🚀 Setup

### Prerequisites
- Node.js (v14+)
- npm/yarn

### Installation
```bash
# Clone repository
git clone https://github.com/your-username/task-manager-api.git
cd task-manager-api

# Install dependencies
npm install

# Start server
node app.js


📚 API Documentation


🔐 Authentication

POST /login
Authenticate user and get JWT token.

Request:

json
{
  "username": "johndoe",
  "password": "securepass123"
}
Response:

json
{
  "msg": "User Authenticated Successfully",
  "token": "eyJhbGciOiJIUzI1NiIsIn..."
}
Errors:

400 - Missing credentials

404 - User not found

401 - Invalid credentials

👥 Users
POST /users
Register new user.

Request:

json
{
  "username": "newuser",
  "email": "user@example.com",
  "password": "securepass123"
}
Validation:

Email format validation

Password min 8 characters

Unique username check

⚙️ Preferences
GET /preferences (Auth)
Get user preferences.

Headers:

Authorization: <token>
PUT /preferences (Auth)
Update preferences.

Request:

json
{
  "preferance": "technology"
}
📰 News
GET /news (Auth)
Get news by preference.

Response:

json
{
  "news": [
    {
      "id": "tech-crunch",
      "name": "TechCrunch",
      "url": "https://techcrunch.com"
    }
  ]
}
✅ Tasks
GET /tasks
Get all tasks with optional filters:

/tasks?completed=true

/tasks?sort=true

/tasks/high (by priority)

POST /tasks
Create new task.

Request:

json
{
  "title": "Complete project",
  "description": "Finish API documentation",
  "priority": "high"
}
🔒 Security
JWT with 1-hour expiration

bcrypt password hashing (salt rounds: 10)

Environment variables for secrets

Input sanitization