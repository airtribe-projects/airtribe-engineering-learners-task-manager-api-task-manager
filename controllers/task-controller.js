const Task = require("../models/task-model");
const TaskStore = require("../data/task-store");
const { BadRequestError, NotFoundError } = require("../errors");
const { StatusCodes } = require("http-status-codes");

const getTaskById = (req, res, next) => {
  const taskId = req.params.id;
  if (!taskId) {
    throw new BadRequestError("Task ID is required");
  }
  const task = TaskStore.tasks.find((t) => t.id === parseInt(taskId));
  if (!task) {
    throw new NotFoundError(`Task with id ${taskId} not found`);
  }
  res.status(StatusCodes.OK).json({ task });
};

const createTask = (req, res, next) => {
  const { title, description, priority } = req.body;

  const newTask = new Task(
    TaskStore.getNextAndIncrementId(),
    title,
    description,
    false,
    priority
  );
  TaskStore.tasks.push(newTask);
  res.status(StatusCodes.CREATED).json({ task: newTask });
};

const updateTask = (req, res, next) => {
  const taskId = req.params.id;
  const { title, description, completed, taskPriority } = req.body;

  const task = TaskStore.tasks.find((t) => t.id === parseInt(taskId));
  if (!task) {
    throw new NotFoundError(`Task with id ${taskId} not found`);
  }
  if (title) task.title = title;
  if (description) task.description = description;
  if (completed !== undefined) task.completed = completed;
  if (taskPriority) task.priority = taskPriority;
  res.status(StatusCodes.OK).json({ task });
};

const getAllTasks = (req, res) => {
  const { priority, sort } = req.query;

  let tasks = [...TaskStore.tasks];

  if (priority) {
    tasks = tasks.filter((task) => task.priority === priority);
  }

  if (sort === "createdDate") {
    tasks.sort((a, b) => new Date(a.createdDate) - new Date(b.createdDate));
  }

  if (sort === "createdDate_desc") {
    tasks.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
  }

  res.status(StatusCodes.OK).json({ tasks });
};

const deleteTask = (req, res, next) => {
  const taskId = req.params.id;

  const taskIndex = TaskStore.tasks.findIndex((t) => t.id === parseInt(taskId));
  if (taskIndex === -1) {
    throw new NotFoundError(`Task with id ${taskId} not found`);
  }
  TaskStore.tasks.splice(taskIndex, 1);
  res.status(StatusCodes.NO_CONTENT).send();
};

module.exports = {
  getTaskById,
  createTask,
  updateTask,
  getAllTasks,
  deleteTask,
};
