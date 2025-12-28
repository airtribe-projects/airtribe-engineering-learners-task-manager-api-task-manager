A simple Node.js + Express REST API for managing tasks.
This project allows users to create, retrieve, update, and delete tasks, with data persisted in a JSON file.

Tech Stack:-
- Node.js
- Express.js
- Nodemon (for development)
- File system (fs) for data storage

Setup:-
- Clone the repository : git clone https://github.com/airtribe-projects/task-manager-api-sufail-dev.git, cd task-manager-api-sufail-dev
- Install dependencies : npm install
- Start the server: nodemon app.js

Server details:-
- Base URL: http://localhost:3000
- Port: 3000

Data Storage :-
- models/data.json

API Endpoints:-
1. Get All Tasks : GET /tasks (Fetches all available tasks)
2. Create a New Task : POST /tasks
  {
    "title": "Testing",
    "description": "Learn Test",
    "completed": true/false
}

3. Get Task by ID : GET /tasks/:id
   eg:- GET /tasks/1
4. Update a Task : PUT /tasks/:id
5. Delete a Task : DELETE /tasks/:id
