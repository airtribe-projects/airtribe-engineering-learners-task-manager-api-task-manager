# Task-Manager-API

## Overview of the Project

A simple REST API for managing tasks built with Express.js. This project demonstrates CRUD operations using REST API principles, including GET, POST, PUT, and DELETE methods. It includes input validation, error handling, and is validated with predefined test cases.


## Setup Instructions

1. Ensure Node.js is installed on your system.
2. Clone the repository from the Git URL.
3. Navigate to the project directory.
4. Run the following command to install dependencies:

   ```bash
   npm install
   ```

   This will install necessary packages including Express, Tap,etc..

## Usage

To start the development server, run:

```bash
node app.js
```

The server will start on port 3000. You can access the API at `http://localhost:3000`.

```bash
npm run test
```

will run all the predefined test case for code check and validation

## API Endpoints

- GET /tasks
  - List all tasks
  - Returns 200 with task list

- GET /tasks/:id
  - Get a task by ID
  - Returns 200 with task data, 404 if not found

- POST /tasks
  - Create a task with title, description, and completed status
  - Returns 201 on success, 400 on validation failure

- PUT /tasks/:id
  - Update existing task by ID (full replacement fields required)
  - Returns 200 on success, 404 if ID not found, 400 on invalid data

- DELETE /tasks/:id
  - Remove a task by ID
  - Returns 200 on success, 404 if not found

### How to test

1. Run automated tests:
   - `npm test`
2. Run server:
   - `node app.js`
3. Use Postman or curl to call endpoints above.
4. Verify status codes and responses from each endpoint match expected behavior.
5. Invalid data should return 400; missing ID should return 404.