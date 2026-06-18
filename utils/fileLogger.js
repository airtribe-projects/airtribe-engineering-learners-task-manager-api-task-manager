const fs = require('fs/promises');
const path = require('path');

const logFile = path.join(__dirname, '../logs/transactions.log');

const logTransaction = async (action, data) => {
  const entry = `[${new Date().toISOString()}] ${action}: ${JSON.stringify(data)}\n`;
  try {
    await fs.appendFile(logFile, entry);
  } catch (err) {
    // If logs folder doesn't exist, create it and retry
    await fs.mkdir(path.join(__dirname, '../logs'), { recursive: true });
    await fs.appendFile(logFile, entry);
  }
};

module.exports = { logTransaction };