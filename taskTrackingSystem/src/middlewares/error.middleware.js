const globalErrorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const status = err.status || 'error';
  const message = err.message || 'Something went wrong on the server';

  // Handle Prisma-specific database errors if any leak through
  let errorResponse = {
    status,
    message,
  };

  // If validation errors are passed as an array/object
  if (err.errors) {
    errorResponse.errors = err.errors;
  }

  // Include stack trace only in development
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
    errorResponse.details = err;
  }

  // Log unexpected server errors
  if (statusCode === 500) {
    console.error('INTERNAL SERVER ERROR 💥:', err);
  }

  res.status(statusCode).json(errorResponse);
};

module.exports = globalErrorHandler;
