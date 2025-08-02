const { HttpError } = require("http-errors");

function errorHandler(err, _req, res, _next) {
  res.status(err.status || 500).send({
    status: "error",
    message: err.message || "Internal Server Error",
  });
}

module.exports = {
  errorHandler
};
