const TASK_PRIORITY = require("../constants/task-priority");

class Task {
  constructor(
    id,
    title,
    description,
    completed = false,
    priority = TASK_PRIORITY.MEDIUM
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.completed = completed;
    this.priority = priority;
    this.createdDate = new Date();
  }
}

module.exports = Task;
