import {
  allowedPriorities
} from "../constants/tasks.constants.js"

// This is a middleware to validate task data in post requests
export const validateCreateTask = (req, res, next) => {
  const { title = '', description = '', completed = null, priority = null } = req.body

  // Validate title
  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({
      message: 'Title is required and must be a non-empty string'
    })
  }
  // Validate description
  if (!description || typeof description !== 'string' || description.trim() === '') {
    return res.status(400).json({
      message: 'Description is required and must be a non-empty string'
    })
  }
  // Validate completed true || false
  if (typeof completed !== 'boolean') {
    return res.status(400).json({
      message: 'Completed must be a boolean'
    })
  }

  if (!allowedPriorities.includes(priority)) {
    return res.status(400).json({
      message: `Priority must be one of the following values: ${allowedPriorities.join(', ')}`
    })
  }

  next()
}

// This is a middleware to validate task data in put requests
export const validateUpdateTask = (req, res, next) => {
  const { title = '', description = '', completed = null, priority = null } = req.body

  // Validate title if provided
  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({
        message: 'Title must be a non-empty string'
      })
    }
  }
  // Validate description if provided
  if (description !== undefined) {
    if (typeof description !== 'string' || description.trim() === '') {
      return res.status(400).json({
        message: 'Description must be a non-empty string'
      })
    }
  }
  // Validate completed if provided
  if (completed !== undefined && typeof completed !== 'boolean') {
    return res.status(400).json({
      message: 'Completed must be a boolean'
    })
  }
  // Validate priority if provided
  if (priority !== undefined && !allowedPriorities.includes(priority)) {
    return res.status(400).json({
      message: `Priority must be one of the following values: ${allowedPriorities.join(', ')}`
    })
  }

  next()
}
