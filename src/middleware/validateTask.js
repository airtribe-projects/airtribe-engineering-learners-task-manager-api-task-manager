const validateTask = (req, res, next) => {
    const { title, description, completed, priority } = req.body;
  
    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }
  
    if (typeof completed !== "boolean") {
      return res.status(400).json({ message: "Completed must be a boolean" });
    }
  
    if (priority && !["low", "medium", "high"].includes(priority)) {
      return res.status(400).json({ message: "Priority must be low, medium, or high" });
    }
  
    next(); 
};
  
module.exports = validateTask;