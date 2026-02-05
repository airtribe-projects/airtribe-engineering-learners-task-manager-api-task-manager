const express = require("express");
const router = express.Router();

let tasks = [
  {
    id: 1,
    title: "Set up environment",
    description: "Install Node.js, npm, and git",
    completed: true,
  },
  {
    id: 2,
    title: "Create a new project",
    description: "Create a new project using the Express application generator",
    completed: true,
  },
  {
    id: 3,
    title: "Install nodemon",
    description: "Install nodemon as a development dependency",
    completed: true,
  },
];

/* validation */
function isValidTask(task) {
  return (
    typeof task.title === "string" &&
    task.title.trim() !== "" &&
    typeof task.description === "string" &&
    typeof task.completed === "boolean"
  );
}

/* GET /tasks */
router.get("/", (req, res) => {
  res.status(200).json(tasks);
});

/* GET /tasks/:id */
router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find(t => t.id === id);

  if (!task) return res.status(404).json({ message: "Task not found" });
  res.status(200).json(task);
});

/* POST /tasks */
router.post("/", (req, res) => {
  if (!isValidTask(req.body)) {
    return res.status(400).json({ message: "Invalid task data" });
  }

  const newTask = {
    id: tasks[tasks.length - 1].id + 1,
    ...req.body,
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

/* PUT /tasks/:id */
router.put("/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = tasks.findIndex(t => t.id === id);

  if (index === -1) return res.status(404).json({ message: "Task not found" });
  if (!isValidTask(req.body)) {
    return res.status(400).json({ message: "Invalid task data" });
  }

  tasks[index] = { id, ...req.body };
  res.status(200).json(tasks[index]);
});

/* DELETE /tasks/:id */
router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = tasks.findIndex(t => t.id === id);

  if (index === -1) return res.status(404).json({ message: "Task not found" });

  tasks.splice(index, 1);
  res.status(200).json({ message: "Task deleted" });
});

module.exports = router;

