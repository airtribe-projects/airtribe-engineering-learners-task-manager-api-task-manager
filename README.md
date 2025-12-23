# Task Manager Backend API

A simple and efficient RESTful API for managing tasks, built with **Node.js** and **Express**. This application uses a local JSON file (`task.json`) for data persistence, allowing you to Create, Read, Update, and Delete (CRUD) tasks easily.

## 🚀 Features

- **RESTful Architecture**: Follows standard HTTP methods (GET, POST, PUT, DELETE).
- **CRUD Operations**: Full management of tasks.
- **Data Persistence**: Tasks are saved locally in `task.json`, so data isn't lost when the server restarts.
- **Input Validation**: Ensures data integrity for creating and updating tasks.
- **Automated Testing**: Integrated test suite using `tap` and `supertest`.

## 🛠️ Prerequisites

Ensure you have the following installed on your machine:
- **Node.js** (v18.0.0 or higher)
- **npm** (Node Package Manager)

## 📦 Installation

1.  **Clone the repository** (or download the source code):
    ```bash
    git clone <your-repository-url>
    cd task-manager
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

## 🏃‍♂️ Running the Application

### Development Mode
To run the server with hot-reloading (restarts automatically on file changes):
```bash
npm start

Production/Standard Mode
To start the server normally:
node app.js


📚 API Documentation
Base URL: http://localhost:3000


Method,Endpoint,Description,Request Body (JSON)
GET,/tasks,Retrieve all tasks,N/A
GET,/tasks/:id,Retrieve a specific task by ID,N/A
POST,/tasks,Create a new task,"{ ""title"": ""String"", ""description"": ""String"", ""completed"": Boolean }"
PUT,/tasks/:id,Update an existing task,"{ ""title"": ""String"", ""description"": ""String"", ""completed"": Boolean }"
DELETE,/tasks/:id,Delete a task,N/A



task-manager/
├── controllers/
│   └── controller.js    # Logic for handling API requests (CRUD)
├── routes/
│   └── route.js         # API route definitions
├── test/
│   └── ...              # Test files
├── node_modules/        # Project dependencies
├── app.js               # Main entry point (Express server setup)
├── task.json            # JSON database for storing tasks
├── package.json         # Project metadata and scripts
├── .gitignore           # Git ignore rules
└── README.md            # Project documentation


👤 Author
Shivansh Submitted for Airtribe Backend Engineering Launchpad