const paramValidation = require("param-validation")
const Joi = require("joi")

const createTaskSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  completed: Joi.boolean().required(),
})

const updateTaskSchema = Joi.object({
  title: Joi.string().optional(),
  description: Joi.string().optional(),
  completed: Joi.boolean().optional(),
})

const deleteTaskSchema = Joi.object({
  id: Joi.number().required(),
})

const getTaskByIdSchema = Joi.object({
  id: Joi.number().required(),
})

module.exports = {
  createTaskSchema,
  updateTaskSchema,
  deleteTaskSchema,
  getTaskByIdSchema,
}
