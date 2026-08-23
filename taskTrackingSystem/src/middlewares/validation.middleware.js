const { BadRequestError } = require('../utils/customErrors');

const validate = (schema) => (req, res, next) => {
  try {
    const parsed = schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    // Replace req parameters with successfully parsed/coerced versions
    if (parsed.body) req.body = parsed.body;
    if (parsed.query) req.query = parsed.query;
    if (parsed.params) req.params = parsed.params;
    next();
  } catch (error) {
    if (error.errors) {
      const formattedErrors = error.errors.map((err) => ({
        field: err.path.slice(1).join('.') || err.path[0],
        message: err.message,
      }));
      const err = new BadRequestError('Validation failed');
      err.errors = formattedErrors;
      return next(err);
    }
    next(error);
  }
};

module.exports = validate;
