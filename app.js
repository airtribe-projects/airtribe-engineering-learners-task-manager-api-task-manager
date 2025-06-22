// Task Manager API using Node.js and Express.

const express = require("express");
const app = express();

app.use(express.json());

// In-memory task storage
let tasks =[
    {
  id: 1,
  title: "Create a new project",
  description : "Create a new project using Magic",
  completed : false
},
    {
  id: 2,
  title: "Learn Node.js",
  description: "Learn Node.js for backend development",
  completed: false
}, 
    {
  id: 3,
  title: "Build a REST API",
  description: "Build a REST API using Express.js",
  completed: true
},
    {
  id: 4,
  title: "Deploy the application",
  description : "Deploy the application to a cloud provider",
  completed : false
}
];

// Implement GET /tasks: Retrieve all tasks.
app.get("/tasks", (req,res)=>{
    res.send(tasks);
});


// Implement GET /tasks/:id: Retrieve a specific task by its ID.
app.get("/tasks/:id", (req,res)=>{
    const id= parseInt(req.params.id);
    const task = tasks.find(task=>task.id===id);
    if(!task){
        return res.status(404).send("Task not found");
    }
    res.send(task);
});


// Implement POST /tasks: Create a new task with the required fields (title, description, completed).
app.post("/tasks", (req,res)=>{
    const task = req.body;
    if(!task.title || !task.description || task.completed === undefinded){
        return res.status(400).send("Title, description, and completed status are required");
    }
    // Check if task with the same title already exists
    const existingTask = tasks.find(t => t.title === task.title);
    if(existingTask){
        return res.status(400).send("Task with the same title already exists");
    }
    // Assign a new ID to the task
    if(!task.id) {
    task.id = tasks.length +1;
    tasks.push(task);
    res.status(201).send(task);
    }
    else {
        return res.status(400).send("ID should not be provided, it will be assigned automatically");
    }
});

// Implement PUT /tasks/:id: Update a task by its ID.
app.put("/tasks/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(task => task.id === id);

    if (taskIndex === -1) {
        return res.status(400).send("Invalid Task ID");
    }

    const updatedTask = req.body;

    // Check if a task with the same title already exists (excluding the current task)
    const existingTask = tasks.find(t => t.title === updatedTask.title && t.id !== id);
    if (existingTask) {
        return res.status(400).send("Task with the same title already exists");
    }

    // Merge old task with updated data to preserve other properties (like id)
    tasks[taskIndex] = { ...tasks[taskIndex], ...updatedTask };

    res.status(200).send(tasks[taskIndex]); // Send back the updated task
});

// Implement DELETE /tasks/:id: Delete a task by its ID.
app.delete("/tasks/:id", (req, res)=>{
    const id = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(task=> task.id===id);
    if(taskIndex === -1){
        return res.status(404).send("Task not found");
    }
    tasks.splice(taskIndex,1);
    res.send(tasks);
});

app.listen(3000,(err)=>{
    if(err){
        console.error("error starting the server:", err);
        return;
    }
    console.log("Server is running on port 3000");
    
});