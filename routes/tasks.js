const express = require("express");

const router = express.Router();

const validateTask = require("../middleware/validateTask");
const {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTasksByPriority,
} = require("../controllers/taskController");

router.get("/", getAllTasks);
router.get("/priority/:level", getTasksByPriority);
router.get("/:id", getTaskById);

router.post("/", validateTask, createTask);
router.put("/:id", validateTask, updateTask);

router.delete("/:id", deleteTask);

module.exports = router;
