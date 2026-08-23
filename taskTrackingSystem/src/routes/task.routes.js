const express = require('express');
const {
  createTask,
  listTasks,
  getTaskDetails,
  updateTask,
  deleteTask,
  completeTask,
  assignTask
} = require('../controllers/task.controller');
const { protect } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validation.middleware');
const { createTaskSchema, updateTaskSchema } = require('../utils/schemas');

const router = express.Router();

router.use(protect);

router.route('/')
  .post(validate(createTaskSchema), createTask)
  .get(listTasks);

router.route('/:taskId')
  .get(getTaskDetails)
  .put(validate(updateTaskSchema), updateTask)
  .delete(deleteTask);

router.patch('/:taskId/complete', completeTask);
router.patch('/:taskId/assign', assignTask);

module.exports = router;
