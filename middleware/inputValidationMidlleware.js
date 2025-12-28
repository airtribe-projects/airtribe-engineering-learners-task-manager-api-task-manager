const inputValidate = (req, res, next) => {
  const { title, description, completed } = req.body;
  if (!title || typeof title !== "string" || title.trim() === "") {
    return res.status(400).json({
      status: "failed",
      message: "title is required and it shoulnt be empty",
    });
  }

  if (
    !description ||
    typeof description !== "string" ||
    description.trim() === ""
  ) {
    return res.status(400).json({
      status: "failed",
      message: "description is required and it shoulnt be empty",
    });
  }

  if (completed !== undefined && typeof completed !== "boolean") {
    return res.status(400).json({
      status: "failed",
      message: "Completed must be a boolean",
    });
  }

  console.log("middleware");
  next();
};

module.exports = { inputValidate };
