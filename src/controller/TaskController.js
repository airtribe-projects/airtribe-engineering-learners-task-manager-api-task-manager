import crypto from "crypto";
import { tasks } from "../models/TaskModel.js";



/**
 * POST /tasks
 * Create a new task
 */
export const createTask = (req, res) => {
  try {
    const { title, description, completed = false, priority = "low" } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    if (!ALLOWED_PRIORITIES.includes(priority)) {
      return res.status(400).json({ message: "Invalid priority value" });
    }

    const task = {
      id: crypto.randomUUID(),
      title,
      description,
      completed,
      priority,
      createdAt: new Date(),
    };

    tasks.push(task);

    return res.status(201).json({
      message: "User task created successfully",
      task,
    });
  } catch (error) {
    console.error("Create Task Error:", error);

    return res.status(500).json({
      message: "Internal server error while creating task",
    });
  }
};

// /**
//  * GET /tasks
//  * Retrieve all tasks
//  */

export const getAllTasks = (req, res) => {
  try {
    const { completed, sort } = req.query;
    let result = [...tasks];

    // Filter by completed
    if (completed !== undefined) {
      const isCompleted = completed === "true";
      result = result.filter((task) => task.completed === isCompleted);
    }

    // Sort by createdAt
    if (sort === "asc") {
      result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    if (sort === "desc") {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return res.status(200).json({
      message: "Tasks retrieved successfully",
      tasks: result,

    });

  } catch (error) {

    console.error("Get All Tasks Error:", error);

    return res.status(500).json({
      message: "Internal server error while fetching tasks",
    });
  }
};

// /**
//  * GET /tasks/:id
//  * Get task by ID
//  */
export const getTaskById = (req, res) => {
  try {
    const { id } = req.params;

    const task = tasks.find((t) => t.id === String(id));

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    return res.status(200).json({
      task,
    });
  } catch (error) {
    console.error("Get Task Error:", error);

    return res.status(500).json({
      message: "Internal server error while fetching task",
    });
  }
};

/**
 * GET /tasks/priority/:level
 * Retrieve tasks by priority
 */
const ALLOWED_PRIORITIES = ["low", "medium", "high"];

export const getTasksByPriority = (req, res) => {
  try {
    const { level } = req.params;

    console.log("Priority level:", level);

    if (!ALLOWED_PRIORITIES.includes(level)) {
      return res.status(400).json({
        message: "Invalid priority level",
      });
    }

    const filteredTasks = tasks.filter(
      (task) => task.priority === level
    );

    return res.status(200).json({
      message: "Tasks retrieved successfully",
      tasks: filteredTasks,
    });
  } catch (error) {
    console.error("Get Tasks By Priority Error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};


// /**
//  * PUT /tasks/:id
//  * Update task by ID
//  */
export const updateTaskById = (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, completed, priority } = req.body;

    const taskIndex = tasks.findIndex((t) => t.id === id);
    if (taskIndex === -1) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (priority && !ALLOWED_PRIORITIES.includes(priority)) {
      return res.status(400).json({ message: "Invalid priority value" });
    }

    tasks[taskIndex] = {
      ...tasks[taskIndex],
      title: title ?? tasks[taskIndex].title,
      description: description ?? tasks[taskIndex].description,
      completed: completed ?? tasks[taskIndex].completed,
      priority: priority ?? tasks[taskIndex].priority,
      updatedAt: new Date(),
    };

    return res.status(200).json({
      message: "Task updated successfully",
      task: tasks[taskIndex],
    });
  } catch (error) {
    console.error("Update Task Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * DELETE /tasks/:id
 * Delete task
 */
export const deleteTaskById = (req, res) => {
  try {
    const { id } = req.params;

    const taskIndex = tasks.findIndex((t) => t.id === id);
    if (taskIndex === -1) {
      return res.status(404).json({ message: "Task not found" });
    }

    const deletedTask = tasks.splice(taskIndex, 1)[0];

    return res.status(200).json({
      message: "Task deleted successfully",
      task: deletedTask,
    });
  } catch (error) {
    console.error("Delete Task Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};