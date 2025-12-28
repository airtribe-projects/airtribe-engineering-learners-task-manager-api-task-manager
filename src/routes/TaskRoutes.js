// import express from "express";

// import { validate } from "../middleware/validate.js";
// import { createTaskSchema } from "../validations/taskValidation.js";

// import {
//     createTask,
//     getAllTasks,
//     getTaskById,
//     getTasksByPriority,
//     updateTaskById,
//     deleteTaskById

// } from "../controller/TaskController.js";

// /**
//  * @swagger
//  * /api/v1/tasks:
//  *   post
// **/
// const routes = express.Router();

// routes.route("/tasks")
//     .post(validate(createTaskSchema), createTask)
//     .get(getAllTasks);

// routes.get("/tasks/priority/:level", getTasksByPriority);

// routes.route("/tasks/:id")
//     .get(getTaskById)
//     .put(updateTaskById)
//     .delete(deleteTaskById);

   
// export default routes;


import express from "express";

import { validate } from "../middleware/validate.js";
import { createTaskSchema } from "../validations/taskValidation.js";

import {
  createTask,
  getAllTasks,                
  getTaskById,
  getTasksByPriority,
  updateTaskById,
  deleteTaskById,
} from "../controller/TaskController.js";

const routes = express.Router();

/**
 * TASK ROUTES
 * Base path: /api/v1
 */

// CREATE + GET ALL (filter & sort supported)
routes
  .route("/tasks")
  .post(validate(createTaskSchema), createTask)
  .get(getAllTasks);

// IMPORTANT: specific routes FIRST
routes.get("/tasks/priority/:level", getTasksByPriority);

// dynamic routes LAST
routes
  .route("/tasks/:id")
  .get(getTaskById)
  .put(updateTaskById)
  .delete(deleteTaskById);

export default routes;


