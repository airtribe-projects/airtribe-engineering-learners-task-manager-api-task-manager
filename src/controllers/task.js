const { Router } = require("express");
const { TaskServices } = require("../services/task");
const { postDataValidator } = require("../middleware/post");

class Routes {
  router;
  taskServices;

  constructor() {
    this.router = Router();
    this.taskServices = new TaskServices();
    this.setupRoutes();
  }

  setupRoutes() {
    this.router.get("/tasks", (req, res) => {
      const filters = {};
      
      // Filter by completion status
      if (req.query.completed !== undefined) {
        filters.completed = req.query.completed;
      }
      
      // Sort by creation date
      if (req.query.sortBy === 'createdAt') {
        filters.sortBy = 'createdAt';
        filters.sortOrder = req.query.sortOrder || 'asc';
      }
      
      const tasks = this.taskServices.getTasks(filters);
      res.status(200).send(tasks);
    });

    this.router.get("/tasks/priority/:level", (req, res) => {
      const priority = req.params.level;
      try {
        const tasks = this.taskServices.getTasksByPriority(priority);
        res.status(200).send(tasks);
      } catch (error) {
        res.status(error.status || 500).send({
          status: "error",
          message: error.message
        });
      }
    });

    this.router.get("/tasks/:id", (req, res) => {
      const id = Number.parseInt(req.params.id);
      const task = this.taskServices.getTaskByID(id);
      res.status(200).send(task);
    });

    this.router.post("/tasks", postDataValidator, (req, res) => {
      const taskPayload = req.body;
      const task = this.taskServices.createTask(taskPayload);
      res.status(201).send(task);
    });

    this.router.put("/tasks/:id", postDataValidator, (req, res) => {
      const id = Number.parseInt(req.params.id);
      const taskPayload = req.body;
      const task = this.taskServices.updateTask(id, taskPayload);
      res.status(200).send(task);
    });

    this.router.delete("/tasks/:id", (req, res) => {
      const id = Number.parseInt(req.params.id);
      const task = this.taskServices.deleteTask(id);
      res.status(200).send(task);
    });
  }
}

module.exports = {
  Routes
};
