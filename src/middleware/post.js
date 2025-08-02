const { TaskDTO } = require("../dto/tasks");
const createHttpError = require("http-errors");

function postDataValidator(req, _res, next) {
  const data = req.body;
  const parsedData = TaskDTO.safeParse(data);
  if (parsedData.success === false) {
    const error = createHttpError(400, parsedData.error.message);
    next(error);
  }
  else {
    next();
  }

}

module.exports = {
  postDataValidator
};
