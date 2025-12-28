const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, '..', 'logs', 'app.log');

const ensureLogDir = () => {
    const dir = path.dirname(logFilePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

const writeToFile = (message) => {
    ensureLogDir();
    fs.appendFile(logFilePath, message + '\n', (err) => {
        if (err) {
            console.error('Failed to write log file', err);
        }
    });
};

const formatMessage = (level, message, error) => {
    const timestamp = new Date().toISOString();
    let log = `[${timestamp}] [${level.toUpperCase()}] ${message}`;

    if (error) {
        log += ` | ${error.stack || error}`;
    }
    return log;
};

const log = (level, message, error = null) => {
    const formattedMessage = formatMessage(level, message, error);

    console[level](formattedMessage);

    writeToFile(formattedMessage);
};

module.exports = {
    info: (message) => log('log', message),
    warn: (message) => log('warn', message),
    error: (message, error) => log('error', message, error)
};
