const express = require("express");
const { getAllTasks, getTaskById, getTasksByPriority, createTask, updateTask, deleteTaskById } = require("../controllers/task.controller");

const router = express.Router()
router.use(express.json());

// GET /tasks?completed=true&sort=asc
router.get("/", getAllTasks);

// GET /tasks/:taskId
router.get("/:taskId", getTaskById);

// POST /tasks
router.post("/", createTask);

// PUT /tasks/:taskId
router.put("/:taskId", updateTask);

// DELETE /tasks/:taskId
router.delete("/:taskId", deleteTaskById);

// GET /tasks/priority/:level
router.get("/priority/:level", getTasksByPriority);

module.exports = router;
