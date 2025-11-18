const taskDummyData = [
  {
    id: 1,
    title: "Task 1",
    description: "Install Node.js, npm, and git",
    completed: false,
    status: "pending",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    title: "Task 2",
    description: "Create a new project using the Express application generator",
    completed: false,
    status: "pending",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 3,
    title: "Task 3",
    description: "Install nodemon as a development dependency",
    completed: false,
    status: "pending",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 4,
    title: "Task 4",
    description: "Install Express",
    completed: false,
    status: "pending",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

function getAllTasks(req, res) {
  return res.status(200).json(taskDummyData)
}

function getTaskById(req, res) {
  const task = taskDummyData.find((task) => task.id === parseInt(req.params.id))
  if (!task) {
    return res.status(404).json({ message: "Task not found" })
  }
  return res.status(200).json(task)
}

function createTask(req, res) {
  const newTask = {
    id: taskDummyData.length + 1,
    title: req.body.title,
    description: req.body.description,
    completed: false,
  }
  taskDummyData.push(newTask)
  return res.status(201).json(newTask)
}

function updateTask(req, res) {
  const task = taskDummyData.find((task) => task.id === parseInt(req.params.id))
  if (!task) {
    return res.status(404).json({ message: "Task not found" })
  }
  task.title = req.body.title
  task.description = req.body.description
  task.completed = req.body.completed
  return res.status(200).json(task)
}

function deleteTask(req, res) {
  const task = taskDummyData.find((task) => task.id === parseInt(req.params.id))
  if (!task) {
    return res.status(404).json({ message: "Task not found" })
  }
  taskDummyData = taskDummyData.filter((task) => task.id !== parseInt(req.params.id))
  return res.status(200).json({ message: "Task deleted successfully" })
}

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
}
