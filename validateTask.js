function validateTask(req, res, next) {
  const { title, description, completed } = req.body;

  if (
    typeof title !== "string" ||
    title.trim() === "" ||
    typeof description !== "string" ||
    description.trim() === ""
  ) {
    return res.status(400).json({
      error:
        "Invalid input. 'title' and 'description' must be non-empty strings.",
    });
  }

 
  if (typeof completed === "string") {
    req.body.completed = completed === "true"; // Convert to boolean
  }
 
  if (typeof completed !== "boolean") {
    return res.status(400).json({
      error: "'completed' must be a boolean.",
    });
  }

  next();  
}

module.exports = validateTask;
