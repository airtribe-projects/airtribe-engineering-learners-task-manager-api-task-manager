import express from 'express'
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTasksByPriority
} from '../services/tasks.services.js'

import {
  validateCreateTask,
  validateUpdateTask
} from '../middlewares/tasks.middleware.js'

import {
  allowedPriorities
} from '../constants/tasks.constants.js'

const router = express.Router()

// GET /tasks?completed=true&sortByDate=true
router.get('/', (req, res) => {
  const { completed, sortByDate } = req.query

  const tasks = getAllTasks({
    completed: completed !== undefined ? completed === 'true' : undefined,
    sortByDate: sortByDate === 'true'
  })

  res.json(tasks)
})

// GET /tasks/:id
router.get('/:id', (req, res) => {
  const task = getTaskById(Number(req.params.id))

  if (!task) {
    return res.status(404).json({ message: `Task not found for id:${req.params.id}` })
  }

  res.json(task)
})


// GET /tasks/priority/:level
router.get('/priority/:level', (req, res) => {
  const { level } = req.params

  if (!allowedPriorities.includes(level)) {
    return res.status(400).json({ message: 'Invalid priority level' })
  }

  res.json(getTasksByPriority(level))
})

router.post('/', validateCreateTask, (req, res) => {
  const { title, description, completed, priority } = req.body

  if (!title || !description || typeof completed !== 'boolean' || !priority) {
    return res.status(400).json({
      message: 'title, description, completed and priority are required'
    })
  }

  const task = createTask({ title, description, completed, priority })
  res.status(201).json(task)
})

router.put('/:id', validateUpdateTask, (req, res) => {
  const id = Number(req.params.id)

  if (isNaN(id)) {
    return res.status(400).json({ message: 'id must be a number' })
  }

  const updatedTask = updateTask(id, req.body)

  if (!updatedTask) {
    return res.status(404).json({ message: 'Task not found' })
  }

  res.json(updatedTask)
})

router.delete('/:id', (req, res) => {
  const id = Number(req.params.id)

  if (isNaN(id)) {
    return res.status(400).json({ message: 'id must be a number' })
  }
  const isDeleted = deleteTask(req.params.id)

  if (!isDeleted) {
    return res.status(404).json({ message: 'Task not found' })
  }

  res.status(204).send()
})

export default router
