let tasksData = require("../model/taskManagerDatabase");

const getAllTasks = async (req, res) => {
  try {
    let { completed } = req.query;
    let isCompleted = completed === "true";
    console.log("isCompleted ===", isCompleted);

    if (completed === undefined) {
      return res.status(200).json(tasksData);
    }
    let filteredData = tasksData.filter((task) => {
      return task.completed === isCompleted;
    });
    return res.status(200).json(filteredData);
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: error,
    });
  }
};

const getTaskFromId = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        status: false,
        messgae: "Please send the ID",
      });
    }

    const taskById = tasksData.find((singleTask) => {
      return singleTask.id === Number(id);
    });

    if (!taskById) {
      return res.status(404).json({
        status: false,
        message: "The task ID not found in the database",
      });
    }

    return res.status(200).json(taskById);
  } catch (error) {
    return res.status(500).json({
      status: false,
      error,
    });
  }
};

const createNewTask = async (req, res) => {
  try {
    const { title, description, completed = false } = req.body; //by default completed is false

    if (!title || !description || !title.trim() || !description.trim()) {
      //validations
      return res.status(400).json({
        status: false,
        message: "Title and Description are required fields",
      });
    }

    if (typeof completed != "boolean") {
      return res.status(400).json({
        status: false,
        message: "The completed can only be a boolean",
      });
    }

    const newTask = {
      id: tasksData.length + 1,
      title: title.trim(),
      description: description.trim(),
      completed,
    };

    tasksData.push(newTask);
    return res.status(201).json({
      status: true,
      newData: newTask,
      entireData: tasksData,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: error.message,
    });
  }
};

const updateTaskFromId = async (req, res) => {
  try {
    let { id } = req.params;
    if (!id)
      return res.status(400).json({
        status: false,
        message: "The ID is required to update the task",
      });

    id = Number(id);
    const { title, description, completed } = req.body;
    if (!title || !description) {
      return res.status(400).json({
        status: false,
        message: "The title and description is required field.",
      });
    }
    if (typeof completed != "boolean") {
      return res.status(400).json({
        status: false,
        message: "The completed field can only be boolean",
      });
    }

    const task = tasksData.find((data) => {
      return data.id == id;
    });

    if (!task) {
      return res.status(404).json({
        status: false,
        message: "Task not found",
      });
    }

    task.title = title;
    task.description = description;
    task.completed = completed;

    return res.status(200).json({
      status: true,
      message: "The task updated successfully",
      entireUpdatedTaskList: tasksData,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: error.message,
    });
  }
};

const deleteTaskFromId = (req, res) => {
  try {
    let { id } = req.params;
    if (!id) {
      return res.status(400).json({
        status: false,
        message: "The ID is required.",
      });
    }
    id = Number(id); //string => integer
    let index = tasksData.findIndex((task) => task.id === id);
    if (index === -1) {
      return res.status(404).json({
        status: false,
        message: `The task with id = ${id} not found.`,
      });
    }
    let originalTaskLength = tasksData.length;
    let deletedTask = tasksData.splice(index, 1);
    let newTaskLength = tasksData.length;
    return res.status(200).json({
      status: true,
      message: `The task with id = ${id} has been deleted.`,
      originalTaskLength,
      newTaskLength,
      deletedRecordsCount: originalTaskLength - newTaskLength,
      deletedTask: deletedTask[0],
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: error.message,
    });
  }
};

module.exports = {
  getAllTasks,
  getTaskFromId,
  createNewTask,
  updateTaskFromId,
  deleteTaskFromId,
};
