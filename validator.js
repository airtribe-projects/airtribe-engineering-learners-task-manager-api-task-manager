const postRequestValidator = (req, res, next) => {
  const { title, description, completed } = req.body;

  if (!title) {
    return res.status(400).send({ message: "Title is required" });
  }

  if (title.length < 3 || title.length > 100) {
    return res
      .status(400)
      .send({ message: "Title must be between 3 and 100 characters" });
  }

  if (!description) {
    return res.status(400).send({ message: "Description is required" });
  }

  if (description.length < 3 || description.length > 100) {
    return res
      .status(400)
      .send({ message: "Description must be between 3 and 100 characters" });
  }

  if (typeof completed !== "boolean") {
    return res.status(400).send({ message: "Completed must be a boolean" });
  }

  next();
};

const putRequestValidator = (req, res, next) => {
  const { title, description, completed } = req.body;

  if (title && (title.length < 3 || title.length > 100)) {
    return res
      .status(400)
      .send({ message: "Title must be between 3 and 100 characters" });
  }

  if (description && (description.length < 3 || description.length > 100)) {
    return res
      .status(400)
      .send({ message: "Description must be between 3 and 100 characters" });
  }

  if (completed !== undefined && typeof completed !== "boolean") {
    return res.status(400).send({ message: "Completed must be a boolean" });
  }

  next();
};

module.exports = { postRequestValidator, putRequestValidator };
