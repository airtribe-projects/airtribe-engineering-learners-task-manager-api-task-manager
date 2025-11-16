// Use pino-http for structured, fast request logging.
// `pino-http` attaches a `log` instance to `req` (accessible as `req.log`).
// Keep this middleware shape so app.js can `require('./middleware/requestLogger')`.
const pinoHttp = require('pino-http');

// Create and export the pino-http middleware instance. We use the default
// configuration here. For development you can run with `NODE_ENV=development`
// and pipe through `pino-pretty` if you want pretty output.
const logger = pinoHttp();

module.exports = logger;
