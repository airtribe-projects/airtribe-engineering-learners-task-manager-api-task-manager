require("dotenv").config();
const express = require("express");
const fs = require("fs");
const tasks = require("./task.json");

const app = express();
const PORT = process.env.PORT;

// const tasks = [
//   {
//     id: 1,
//     title: "Task 1",
//     description: "Description 1",
//     completed: false,
//   },
//   {
//     id: 2,
//     title: "Task 2",
//     description: "Description 2",
//     completed: true,
//   },
//   {
//     id: 3,
//     title: "Task 3",
//     description: "Description 3",
//     completed: false,
//   },
// ];

app.use(express.json());

app.get("/tasks", (req, res) => {
  const completed = req.query.completed;
  if (completed !== undefined) {
    const filteredTasks = tasks.filter(
      (task) => task.completed == (completed === "true")
    );
    return res.json(filteredTasks);
  }

  return res.json(tasks);
});

app.get("/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find((task) => task.id == id);
  if (!task) {
    return res.status(404).send("Task not found");
  }
  return res.json(task);
});

app.post("/tasks", (req, res) => {
  const { title, description, completed } = req.body;
  if (!title) {
    return res.status(400).send("Title is required");
  }
  if (!description) {
    return res.status(400).send("Description is required");
  }
  if (!completed) {
    return res.status(400).send("Completed is required");
  }
  tasks.push({
    id: tasks.length + 1,
    title: title,
    description: description,
    completed: Boolean(completed),
  });
  fs.writeFile("./task.json", JSON.stringify(tasks), (err, data) => {
    if (err) {
      console.log(err);
    }
    return res.status(201).send("Task created successfully");
  });
});

app.put("/tasks/:id", (req, res) => {
  //TODO: Implement this
  const id = parseInt(req.params.id);
  const task = tasks.find((task) => task.id == id);
  if (!task) {
    return res.status(404).send("Task not found");
  }
  const index = tasks.indexOf(task);

  tasks[index] = {
    ...task,
    ...req.body,
  };

  fs.writeFile("./task.json", JSON.stringify(tasks), (err) => {
    if (err) {
      console.log(err);
    }
    return res.json(task);
  });
});

app.delete("/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find((task) => task.id == id);
  if (!task) {
    return res.status(404).send("Task not found");
  }
  const index = tasks.indexOf(task);
  tasks.splice(index, 1);
  fs.writeFile("./task.json", JSON.stringify(tasks), (err) => {
    if (err) {
      console.log(err);
    }
    return res.json(task);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
