const Data = require("../../task.json");

class Database {
  constructor() {
    if (Database.instance) {
      return Database.instance;
    }
    
    this.tasks = Data.tasks.map(task => ({
      ...task,
      priority: task.priority || "medium",
      createdAt: task.createdAt ? new Date(task.createdAt) : new Date()
    }));
    
    Database.instance = this;
  }
  
  set(task) {
    const newTask = {
      ...task,
      id: this.tasks.length + 1,
      createdAt: new Date(),
      priority: task.priority || "medium"
    };
    this.tasks.push(newTask);
    return newTask;
  }
  
  get(id) {
    return this.tasks[id - 1];
  }
  
  delete(id) {
    this.tasks.splice(id - 1, 1);
  }
  
  getTasks(filters = {}) {
    let filteredTasks = this.tasks.slice();
    
    // Filter by completion status
    if (filters.completed !== undefined) {
      const completed = filters.completed === 'true' || filters.completed === true;
      filteredTasks = filteredTasks.filter(task => task.completed === completed);
    }
    
    // Sort by creation date
    if (filters.sortBy === 'createdAt') {
      filteredTasks.sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return filters.sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
      });
    }
    
    return filteredTasks;
  }
  
  getTasksByPriority(priority) {
    return this.tasks.filter(task => task.priority === priority);
  }
  
  getTaskByID(id) {
    return this.get(id);
  }
  
  update(id, task) {
    const existingTask = this.tasks[id - 1];
    if (existingTask) {
      this.tasks[id - 1] = {
        ...existingTask,
        ...task,
        id: existingTask.id,
        createdAt: existingTask.createdAt
      };
      return this.tasks[id - 1];
    }
    return null;
  }
  
  // Static method to get the singleton instance
  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
  
  // Method to reset the database (useful for testing)
  reset() {
    this.tasks = Data.tasks.map(task => ({
      ...task,
      priority: task.priority || "medium",
      createdAt: task.createdAt ? new Date(task.createdAt) : new Date()
    }));
  }
}

// Create the singleton instance
const DB = Database.getInstance();

module.exports = {
  Database,
  DB
};
