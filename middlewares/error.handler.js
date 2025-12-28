const handleError = (err, statusCode = 500, message = 'Internal Server Error') => {
  const errorResponse = {
    statusCode,
    message
  };

  if (process.env.NODE_ENV === 'development') {
    errorResponse.type = err.constructor.name;
    errorResponse.stack = err.stack;
  }

  return errorResponse;
};

const errorHandler = (err, req, res, next) => {
  const errorResponse = handleError(err, err.statusCode, err.message);
  res.status(errorResponse.statusCode).json(errorResponse);
};

export default errorHandler;