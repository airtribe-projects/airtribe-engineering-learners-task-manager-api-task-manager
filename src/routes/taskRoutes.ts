import express from 'express';
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTasksByPriority
} from '../controllers/taskController';

const router = express.Router();

router.get('/', getAllTasks);
router.get('/priority/:level', getTasksByPriority);
router.get('/:id', getTaskById);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;
