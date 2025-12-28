const { StatusCodes } = require("http-status-codes");
const { CustomApiError } = require("../errors");
const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong try again later",
  };

  if (err instanceof CustomApiError) {
    return res.status(err.statusCode).json({ msg: err.message });
  }

  return res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandlerMiddleware;
