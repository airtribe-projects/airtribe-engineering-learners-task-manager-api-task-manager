const allTasks = require("../data/task.json");
const tasks = allTasks.tasks;

//Get All tasks
const getAllTasks = (req, res) => {

    const allTasks = tasks;
  
    // Handle case where tasks are undefined or empty
    if (!allTasks || allTasks.length === 0) {
      return res.status(404).json({ message: "No tasks found" });
    }
  
    const { completed, sort } = req.query;
    let filteredTasks = allTasks;
  
    // Check if the 'completed' query parameter is provided
    if (completed === "true" || completed === "false") {
      const isCompleted = completed === "true"; // Convert to boolean
      filteredTasks = allTasks.filter((task) => task.completed === isCompleted);
      // return res.status(200).json(filteredTasks);
    }
  
    // Sort tasks by 'createdAt' if the 'sort' query parameter is provided
    if (sort === "asc") {
      filteredTasks.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sort === "desc") {
      filteredTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  
    return res.status(200).json(filteredTasks);
  }


// Get Task By Id
const getTaskById = (req, res, next) => {
    const reqId = req.params.id;
    
    const taskReq = tasks?.find((task) => {
      if (task.id == reqId) return task;
    });

    if (!taskReq) {
      const error = new Error("Task not found");
      error.status = 404;
      return next(error); // Pass the error to the error handler
    }

    // if(taskReq.length === 0) {
    //   return res.status(404).json({ message: "Task not found" });
    // }
    res.status(200).json(taskReq);
  }

// Get Task By Priority Level
const getTaskByPriorityLevel = (req, res) => {
    const reqLevel = req.params.level;
    const taskReq = tasks?.filter((task) => {
      if (task.priority === reqLevel) return task;
    });
  
    if (!taskReq || taskReq.length === 0) {
      return res.status(404).json({ message: "No tasks found" });
    }
  
    res.send(taskReq);
  }

// Create Task
const createTask = (req, res, next) => {

    const { title, description, completed, priority } = req.body;

    // This is giving error once you delete and add a new task
    // const newId = tasks?.length + 1;
    const newId = tasks?.length > 0 ? Math.max(...tasks.map((task) => task.id)) + 1 : 1;
  
    const newObj = {
      id: newId,
      title: title,
      description: description,
      completed: completed,
      createdAt: new Date().toISOString(),
      priority: priority || "low", // Default to 'low' if not provided
    };
    tasks?.push(newObj);
    res.status(201).json(newObj);
  }

// Update Task By Id
const updateTaskById = (req, res) => {
    const reqId = parseInt(req.params.id);
    const taskIndex = tasks?.findIndex((task) => task.id === reqId);
  
    if (taskIndex === -1) {
      return res.status(404).json({ message: "Task not found" });
    }
  
    const data = req.body;
  
    const task = tasks[taskIndex];
    task.title = data.title || task.title;
    task.description = data.description || task.description;
    task.completed =
      data.completed !== undefined ? data.completed : task.completed;
    task.priority = data.priority || task.priority; // Update priority if provided
    res.status(200).json(task);
  }

// Delete Task By Id
const deleteTaskById = (req, res) => {
    const reqId = parseInt(req.params.id);
    const taskIndex = tasks?.findIndex((task) => task.id === reqId);
  
  
    if (taskIndex === -1) {
      return res.status(404).json({ message: "Task not found" });
    }
  
    // const removedTask = tasksData.tasks[taskIndex];
    // console.log("Removed Task", removedTask);
    tasks?.splice(taskIndex, 1);
    res.status(200).send();
  }

  module.exports = {
    getAllTasks,
    getTaskById,
    getTaskByPriorityLevel,
    createTask,
    updateTaskById,
    deleteTaskById,
  };