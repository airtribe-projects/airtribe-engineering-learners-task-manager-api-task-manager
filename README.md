Task Management API
This project is a RESTful API for managing tasks, built with Node.js and Express.js.
Setup Instructions

Clone the repository
Run npm install to install dependencies
Start the server with npm start
Run tests with npm test

API Endpoints
GET /tasks
Retrieve all tasks.
GET /tasks/:id
Retrieve a specific task by ID
POST /tasks
Create a new task. Required fields:

title (string)
description (string)
completed (boolean)

PUT /tasks/:id
Update an existing task. Fields same as POST.
DELETE /tasks/:id
Delete a task by ID
Project Structure

app.js: Main application file
taskRoutes.js: Contains all the task-related routes
task.json: Initial task data
test/server.test.js: Contains all the API tests