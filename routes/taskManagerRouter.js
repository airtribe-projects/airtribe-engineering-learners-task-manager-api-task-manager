const {
  getAllTasks,
  getTaskFromId,
  createNewTask,
  updateTaskFromId,
  deleteTaskFromId
} = require("../controller/taskManagerController");

const router = require("express").Router();

//1. Get all the tasks
router.get("/", getAllTasks);
//2. Get the task with ID
router.get("/:id", getTaskFromId);

//3. Create a new task 
router.post("/" , createNewTask); 

//4. Update a task with id 
router.put("/:id" , updateTaskFromId);

//5. Delete the task with id 
router.delete("/:id" , deleteTaskFromId); 
module.exports = router; 
