# Task Manager API

A lightweight RESTful API built with **Node.js** and **Express.js** to manage tasks. This project demonstrates basic CRUD operations, route parameters, query strings.

---

## Features

* **List Tasks**: Fetch all tasks or filter them by completion status.
* **Priority Filtering**: Retrieve tasks based on priority levels (e.g., high, medium, low).
* **CRUD Operations**: Create, Read, Update, and Delete tasks.
* **Input Validation**: Basic checks for required fields on task creation.

---

## Installation

1. **Clone the repository**:
   
   ```bash
   git clone <your-repo-url>

2. **Install Necessary Packages**:
   
   ```bash
   npm install

3. **Run Application**:
   
   ```bash
   node app.js
  
  The server will start at http://localhost:3000

---

## API Endpoints

### 1. Task Retrieval
| Method | Endpoint | Description | Query/Params |
| :--- | :--- | :--- | :--- |
| **GET** | `/tasks` | Get all tasks | `?completed=true/false` (Optional) |
| **GET** | `/tasks/:id` | Get task by ID | `:id` (Task ID) |
| **GET** | `/tasks/priority/:level` | Filter by priority | `:level` (e.g., low, medium, high) |

### 2. Task Management
| Method | Endpoint | Description | Request Body (JSON) |
| :--- | :--- | :--- | :--- |
| **POST** | `/tasks` | Create new task | `{ "title", "description", "completed"?, "priority"? }` |
| **PUT** | `/tasks/:id` | Update task | `{ "title"?, "description"?, "completed"?, "priority"? }` |
| **DELETE** | `/tasks/:id` | Delete task | *None* |

---

### Request Body Schema
When creating or updating tasks, use the following structure:

```json
{
  "title": "String (Required)",
  "description": "String (Required)",
  "completed": "Boolean (Default: false)",
  "priority": "String (Default: 'low')"
}

