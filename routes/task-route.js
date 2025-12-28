const express = require("express");
const router = express.Router();
const {
  getTaskById,
  createTask,
  updateTask,
  getAllTasks,
  deleteTask,
} = require("../controllers/task-controller");
const {
  validateCreateTask,
  validateTaskIdParam,
  validateUpdateTask,
  validatePriorityQuery,
} = require("../middlewares/validate-task");

router.get("/:id", validateTaskIdParam, getTaskById);
router.post("/", validateCreateTask, createTask);
router.put("/:id", validateTaskIdParam, validateUpdateTask, updateTask);
router.get("/", validatePriorityQuery, getAllTasks);
router.delete("/:id", validateTaskIdParam, deleteTask);

module.exports = router;
