const express = require("express");
const router = express.Router();
const { getAllTasks, getTasksById, createTask, updateTask, deleteTask, getTasksByPriority } = require("../controllers/taskControllers");

router.get("/", getAllTasks);
router.get("/:id", getTasksById);
router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);
router.get("/priority/:level", getTasksByPriority);

module.exports = router;