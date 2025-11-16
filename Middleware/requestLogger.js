// Middleware to log HTTP requests with parameters
const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const path = req.path;
  const query = JSON.stringify(req.query);
  const body = JSON.stringify(req.body);
  const params = JSON.stringify(req.params);

  console.log(`
    ╔════════════════════════════════════════════════════════════╗
    ║ [${timestamp}]
    ║ Method: ${method}
    ║ Path: ${path}
    ║ Query: ${query}
    ║ Params: ${params}
    ║ Body: ${body}
    ╚════════════════════════════════════════════════════════════╝
  `);

  next();
};

module.exports = requestLogger;
