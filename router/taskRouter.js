const express = require("express");
const {
  getTasks,
  getTaskById,
  addTask,
  updateTaskById,
  deleteTask,
  getTasksByPriority,
} = require("../controllers/taskController");
const validateBody = require("../middlewares/validateBody");
const router = express.Router();

router.get("/", getTasks);

router.get("/:id", getTaskById);

router.post("/", validateBody, addTask);

router.put("/:id", validateBody, updateTaskById);

router.delete("/:id", deleteTask);

router.get("/priority/:level", getTasksByPriority);

module.exports = router;
