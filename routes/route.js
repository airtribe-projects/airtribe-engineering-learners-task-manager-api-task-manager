const express = require("express");
const router = express.Router();
const {
  getTask,
  getTaskById,
  createTask,
  deleteTask,
  updateTask,
} = require("../controllers/controller");

router.get("/", getTask);
router.get("/:id", getTaskById);
router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

module.exports = router;
