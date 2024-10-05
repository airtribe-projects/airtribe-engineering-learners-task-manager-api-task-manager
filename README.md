Task Management API
This is a simple RESTful API for managing tasks, built with Node.js, Express.js, and in-memory data storage. It supports basic CRUD operations (Create, Read, Update, Delete), input validation using Joi, and routing.

Features
- Create, read, update, and delete tasks.
- Input validation for task data using Joi.
- In-memory storage for tasks (no database).
- Error handling for invalid input and non-existent routes.

Prerequisites
Make sure you have the following installed on your system:
- Node.js (v14.x or later)
- npm (comes with Node.js)

Testing the API
You can test the API using tools like:
- Postman
- curl

Example curl command to create a task:
curl -X POST -H "Content-Type: application/json" -d '{"title": "Task 1", "description": "This is task 1"}' http://localhost:4500/api/tasks

Example curl command to get a task:
curl http://localhost:4500/api/tasks