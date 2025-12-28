const express = require("express");
const { inputValidate } = require("../middleware/inputValidationMidlleware");
const {
  getAllTasks,
  getATask,
  createANewTask,
  updateATask,
  deleteATask,
} = require("../controllers/taskController");
const taskRouter = express.Router();
taskRouter.route("/").get(getAllTasks).post(inputValidate, createANewTask);
taskRouter
  .route("/:id")
  .get(getATask)
  .put(inputValidate, updateATask)
  .delete(deleteATask);

module.exports = taskRouter;
