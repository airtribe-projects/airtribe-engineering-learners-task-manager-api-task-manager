const VALID_PRIORITIES = ["low", "medium", "high"];

function validateTask(req, res, next) {
  const { title, description, completed, priority } = req.body;

  if (!title || typeof title !== "string" || !title.trim()) {
    return res.status(400).json({
      message: "Title is required",
    });
  }

  if (!description || typeof description !== "string" || !description.trim()) {
    return res.status(400).json({
      message: "Description is required",
    });
  }

  if (typeof completed !== "boolean") {
    return res.status(400).json({
      message: "Completed must be a boolean value",
    });
  }

  if (!VALID_PRIORITIES.includes(priority)) {
    return res.status(400).json({
      message: "Priority must be low, medium or high",
    });
  }

  next();
}

module.exports = validateTask;
