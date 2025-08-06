const validateBody = (req, res, next) => {
  const { title, description, completed } = req.body;

  const missingFields = [];
  if (typeof title === "undefined" || title === "") missingFields.push("Title");
  if (typeof description === "undefined" || description === "") missingFields.push("Description");
  if (typeof completed === "undefined") missingFields.push("Completed");

  const invalidFields = [];
  if (typeof title !== "undefined" && (typeof title !== "string" || title.trim() === ""))
    invalidFields.push("Title must be a non-empty string");
  if (typeof description !== "undefined" && (typeof description !== "string" || description.trim() === ""))
    invalidFields.push("Description must be a non-empty string");
  if (typeof completed !== "undefined" && typeof completed !== "boolean")
    invalidFields.push("Completed must be a boolean");

  if (missingFields.length || invalidFields.length) {
    const messages = [];
    if (missingFields.length) {
      messages.push(
        missingFields.length === 1
          ? `${missingFields[0]} is missing`
          : `${missingFields.join(", ")} are missing`
      );
    }
    if (invalidFields.length) {
      messages.push(...invalidFields);
    }
    return res.status(400).json({ error: messages.join(". ") });
  }

  next();
};



module.exports = module.exports = validateBody;
