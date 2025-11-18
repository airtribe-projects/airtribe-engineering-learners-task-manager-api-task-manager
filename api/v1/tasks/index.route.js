const express = require("express")
const router = express.Router()
const { createTaskSchema, updateTaskSchema, deleteTaskSchema, getTaskByIdSchema } = require("./validation")
const { getAllTasks, getTaskById, createTask, updateTask, deleteTask } = require("./index")

router.get("/", getAllTasks)
router.get("/:id", paramValidation.validate(getTaskByIdSchema), getTaskById)
router.post("/", paramValidation.validate(createTaskSchema), createTask)
router.put("/:id", paramValidation.validate(updateTaskSchema), updateTask)
router.delete("/:id", paramValidation.validate(deleteTaskSchema), deleteTask)

module.exports = router
