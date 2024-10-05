const Joi = require('joi');

// Define a schema for task validation
const taskSchema = Joi.object({
  title: Joi.string().min(3).max(30).required(),
  description: Joi.string().min(5).required(),
  completed: Joi.boolean()
});

// Middleware function for validation
const validateTask = (req, res, next) => {
  const { error } = taskSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

module.exports = validateTask;
