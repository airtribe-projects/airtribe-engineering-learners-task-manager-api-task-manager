const CustomApiError = require("./custom-api-error");
const StatusCodes = require("http-status-codes").StatusCodes;

class NotFoundError extends CustomApiError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.NOT_FOUND;
  }
}

module.exports = NotFoundError;
