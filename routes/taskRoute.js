const express = require("express");
const router = express.Router();
const {
  CreateTask,
  GetAllTasks,
  GetTaskById,
  UpdateTaskById,
  DeleteTaskById,
} = require("../controllers/taskController");

router.get("/tasks", GetAllTasks);
router.post("/tasks", CreateTask);
router.get("/tasks/:id", GetTaskById);
router.put("/tasks/:id", UpdateTaskById);
router.delete("/tasks/:id", DeleteTaskById);

module.exports = router;
