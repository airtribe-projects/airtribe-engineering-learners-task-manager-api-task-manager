const { TaskDTO } = require("../dto/tasks");
const { createTask, deleteTask, getTaskByID, getTasks, updateTask, getTasksByPriority } = require("../dao/tasks");

class TaskServices {
  createTask(taskPayload) {
    return createTask(taskPayload);
  }

  getTaskByID(taskID) {
    return getTaskByID(taskID);
  }

  getTasks(filters = {}) {
    return getTasks(filters);
  }

  getTasksByPriority(priority) {
    return getTasksByPriority(priority);
  }

  updateTask(taskID, taskPayload) {
    return updateTask(taskID, taskPayload);
  }

  deleteTask(taskID) {
    return deleteTask(taskID);
  }
}

module.exports = {
  TaskServices
};
