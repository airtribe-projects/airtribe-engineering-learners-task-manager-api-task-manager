const express = require("express");
const {
  getAllTasks,
  getTaskById,
  getTaskByPriorityLevel,
  createTask,
  updateTaskById,
  deleteTaskById,
} = require("../controllers/taskController");

const validateTask = require("../middleware/validateTask");
const router = express.Router();

router.use(express.json());

router.get("/", getAllTasks);
router.get("/:id", getTaskById);
router.get("/priority/:level", getTaskByPriorityLevel);
router.post("/", validateTask, createTask);
router.put("/:id", validateTask, updateTaskById);
router.delete("/:id", deleteTaskById);


module.exports = router;