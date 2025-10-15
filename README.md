# Task Management API

## Overview

This is a simple **Task Management REST API** built using **Node.js** and **Express.js**.
It allows users to:

* Create new tasks
* Retrieve all tasks
* Retrieve a task by ID
* Filter tasks by completion (`completed=true/false`)
* Update existing tasks
* Delete tasks


---

## Setup Instructions

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Run the application:**

   ```bash
   node app.js
   ```

---

## API Endpoints Documentation

### 1. **Create a Task**

* **URL:** `/tasks`
* **Method:** `POST`
* **Request Body:**

  ```json
  {
    "title": "Task Title",
    "description": "Task Description",
    "completed": false
  }
  ```
* **Responses:**

  * `201 Created`: Task successfully created.
  * `400 Bad Request`: Invalid/missing data.

---

### 2. **Get All Tasks**

* **URL:** `/tasks`
* **Method:** `GET`
* **Response Example:**

  ```json
  [
    {
      "id": 1,
      "title": "Set up environment",
      "description": "Install Node.js, npm, and git",
      "completed": true
    }
  ]
  ```
* **Responses:**

  * `200 OK`: Returns list of tasks.

---

### 3. **Get Task by ID**

* **URL:** `/tasks/:id`
* **Method:** `GET`
* **Responses:**

  * `200 OK`: Returns the requested task.
  * `404 Not Found`: Task with given ID does not exist.

---
### 4. **Get Task by completion status**

* **URL:** `/tasks?completed=true`
* **Method:** `GET`
* **Responses:**

  * `200 OK`: Returns the requested task.
  * `404 Not Found`:  No tasks match the completed status.
.

---

### 5. **Update Task by ID**

* **URL:** `/tasks/:id`
* **Method:** `PUT`
* **Request Body:**

  ```json
  {
    "title": "Updated Title",
    "description": "Updated Description",
    "completed": true
  }
  ```
* **Responses:**

  * `200 OK`: Task successfully updated.
  * `400 Bad Request`: Invalid data format.
  * `404 Not Found`: Task with given ID does not exist.

---

### 6. **Delete Task by ID**

* **URL:** `/tasks/:id`
* **Method:** `DELETE`
* **Responses:**

  * `200 OK`: Task successfully deleted.
  * `404 Not Found`: Task with given ID does not exist.

---

## Author

Bharat Khairnar
