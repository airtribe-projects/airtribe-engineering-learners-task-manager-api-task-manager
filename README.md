# Task Manager API

## Overview
This project is a RESTful API for managing tasks. It is built using Node.js and Express.js, and utilizes in-memory data storage. The API allows users to perform CRUD operations on tasks, with additional features like filtering, sorting, and setting task priorities.

## Project Setup
1. **Accept the Assignment**
   - Accept the classroom assignment by visiting [this link](https://classroom.github.com/a/8FaMiv9J).

2. **Install Dependencies**
   - Run the following command to install Express.js and other required packages:
     ```bash
     npm install express
     ```

## API Endpoints
- **GET /tasks**
  - Retrieve all tasks. Supports filtering by completion status.
  
- **GET /tasks/:id**
  - Retrieve a specific task by its ID.
  
- **POST /tasks**
  - Create a new task with necessary fields: `title`, `description`, and `completed`.
  
- **PUT /tasks/:id**
  - Update an existing task by its ID.
  
- **DELETE /tasks/:id**
  - Delete a task by its ID.

## Input Validation & Error Handling
- Validate task fields to ensure `title` and `description` are not empty and `completed` is a boolean.
- Handle errors such as `404 Not Found` for non-existent task IDs and `400 Bad Request` for invalid inputs.

## Optional Features
- Filter tasks by completion status.
- Sort tasks by creation date.
- Add and filter tasks by priority level: low, medium, high.

## Testing
- Use Postman or curl to test the API endpoints.
- Validate both functionality and error handling.



## License
- This project is open-source and available under the MIT License.