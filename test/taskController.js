const Task = require("./model.js");

// Helper for validation
const validateTaskInput = (title, description, completed) => {
  if (!title || !description) {
    return "Title and description are required.";
  }
  if (completed !== undefined && typeof completed !== "boolean") {
    return "'completed' status must be a boolean (true or false).";
  }
  if (title !== undefined && title.trim() === "") {
    return "Title cannot be empty.";
  }
  if (description !== undefined && description.trim() === "") {
    return "Description cannot be empty.";
  }
  return null;
};

const getAllTasks = async (req, res) => {
  try {
    console.log("Getting all tasks");
    const tasks = await Task.findAll();
    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "An error occurred while fetching tasks." });
  }
};

const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
    if (task) {
      res.json(task);
    } else {
      res.status(404).json({ message: `Task with ID ${id} not found.` });
    }
  } catch (error) {
    console.error("Error retrieving task:", error);
    res.status(500).json({ message: "Error retrieving task." });
  }
};

const createTask = async (req, res) => {
  const { title, description, completed } = req.body;
  const validationError = validateTaskInput(title, description, completed);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }
  try {
    const newTask = await Task.create({ title, description, completed });
    res.status(201).json(newTask);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Unable to add task." });
  }
};

const updateTask = async (req, res) => {
  const { title, description, completed } = req.body;
  const { id } = req.params;
  const validationError = validateTaskInput(title, description, completed);
  if (validationError && (title !== undefined || description !== undefined)) {
    return res.status(400).json({ message: validationError });
  }
  try {
    const updatedTask = await Task.update(id, req.body);
    if (updatedTask) {
      res.json(updatedTask);
    } else {
      res.status(404).json({ message: `Task with ID ${id} not found.` });
    }
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: `Unable to update task with id: ${id}.` });
  }
};

const deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedTask = await Task.remove(id);
    if (deletedTask) {
      res.json({ message: `Task with ID ${id} deleted.`, task: deletedTask });
    } else {
      res.status(404).json({ message: `Task with ID ${id} not found.` });
    }
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: `Unable to delete task with id: ${id}.` });
  }
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};