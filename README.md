# Task Manager API

## Overview
The **Task Manager API** is a RESTful service that allows users to create, read, update, and delete tasks. This API is designed to manage task-related operations such as assigning tasks to users, updating task statuses, and retrieving lists of tasks. The API is built using Node.js, Express

## Features
- **Create a new task**
- **View all tasks**
- **Update an existing task**
- **Delete a task**
- **User authentication (optional)**

## Technologies Used
- Node.js
- Express.js
  
---

## Setup Instructions

### Prerequisites
Ensure that you have the following installed on your local machine:
- **Node.js** (v14 or above)
- **express***
- **Postman** (for testing the API, optional)

### Steps to Set Up the Project

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/task-manager-api-ivyan26733.git
   cd task-manager-api-ivyan26733```

2. **Install Dependencies**: Run the following command to install all the required dependencies.
  ``` npm install```
  
3. **Create a .env File**: Create a .env file in the root directory with the following environment variables:
```PORT=3000```
4. **Start the Server**: Run the following command to start the server:
 ```npm run dev```
5. **Access the API**: The API will be accessible at:
http://localhost:3000


# API Endpoints
 Below is a list of all API endpoints and how to interact with them. For testing the API, you can use Postman or cURL.

1. **Create a New Task**
  -Method: POST
  -Endpoint: /tasks
  -Description: Creates a new task.
  -Request Body (JSON):
  -{
    -"title": "Complete Project",
    -"description": "Finish the API section of the project",
    -"completed": false
  -}
**Response (201 - Created)**:
{
  "_id": "task_id",
  "title": "Complete Project",
  "description": "Finish the API section of the project",
  "completed": false,
  "owner": "user_id"
}
2. **Get All Tasks**
  Method: GET
  Endpoint: /tasks
  Description: Fetches all tasks for the authenticated user.
  Response (200 - OK):
  [
    {
      "_id": "task_id",
      "title": "Complete Project",
      "description": "Finish the API section of the project",
      "completed": false
    }
]
3. **Get a Single Task**
  Method: GET
  Endpoint: /tasks/:id
  Description: Fetches a task by its ID.
  Response (200 - OK):

  {
    "_id": "task_id",
    "title": "Complete Project",
    "description": "Finish the API section of the project",
    "completed": false
  }
4. **Update a Task**
  Method: PATCH
  Endpoint: /tasks/:id
  Description: Updates a task's information.
  Request Body (JSON):
  {
    "completed": true
  }
  Response (200 - OK):
  
  {
    "_id": "task_id",
    "title": "Complete Project",
    "description": "Finish the API section of the project",
    "completed": true
  }
5. **Delete a Task**
  Method: DELETE
  Endpoint: /tasks/:id
  Description: Deletes a task by its ID.
  Response (200 - OK):
  {
    "message": "Task deleted successfully"
  }
  
# Testing the API
You can use Postman or cURL to test the API endpoints.

Using Postman
Open Postman and create a new request.
Enter the API endpoint URL.
Select the HTTP method (GET, POST, PATCH, DELETE).
Provide the request body as required (for POST or PATCH requests).
Send the request and view the response.

