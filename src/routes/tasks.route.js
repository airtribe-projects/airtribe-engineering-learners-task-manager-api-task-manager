const express = require("express");
const router = express.Router();
const {
    filterTasks,
  getTasks,
  addTasks,
  updateTask,
  deleteTask,
  filterByPriority,
} = require("../controllers/tasks");



router.post("/tasks", addTasks);
router.get("/tasks", filterTasks);

router.get("/tasks/:id", getTasks);
router.put("/tasks/:id", updateTask);

router.get("/tasks/priority/:level", filterByPriority);
router.delete("/tasks/:id", deleteTask);

module.exports = router;
