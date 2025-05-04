# Task Manager API

## Overview

The Task Manager API is a simple backend application for managing tasks. It allows users to create, retrieve, update, and delete tasks. This project is built using Node.js and Express.js.

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/airtribe-projects/task-manager-api-aneesazc.git
   ```
2. Navigate to the project directory:
   ```bash
   cd task-manager-api-aneesazc
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Run tests:
   ```bash
   npm test
   ```

## API Endpoints

### 1. Create a Task

- **URL:** `/tasks`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
    "title": "Task Title",
    "description": "Task Description",
    "completed": false
  }
  ```
- **Response:**
  - `201 Created` on success
  - `400 Bad Request` if required fields are missing

### 2. Get All Tasks

- **URL:** `/tasks`
- **Method:** `GET`
- **Response:**
  - `200 OK` with a list of tasks

### 3. Get a Task by ID

- **URL:** `/tasks/:id`
- **Method:** `GET`
- **Response:**
  - `200 OK` with the task details
  - `404 Not Found` if the task does not exist

### 4. Update a Task

- **URL:** `/tasks/:id`
- **Method:** `PUT`
- **Request Body:**
  ```json
  {
    "title": "Updated Title",
    "description": "Updated Description",
    "completed": true
  }
  ```
- **Response:**
  - `200 OK` on success
  - `400 Bad Request` if invalid data is provided
  - `404 Not Found` if the task does not exist

### 5. Delete a Task

- **URL:** `/tasks/:id`
- **Method:** `DELETE`
- **Response:**
  - `200 OK` on success
  - `404 Not Found` if the task does not exist

## Testing the API

You can test the API using tools like [Postman](https://www.postman.com/) or [cURL](https://curl.se/). Alternatively, you can run the provided test suite:

```bash
npm run test
```
