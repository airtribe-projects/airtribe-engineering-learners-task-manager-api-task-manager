const http = require('http');
const app = require('./app');
const connectDB = require('./config/database');
const { initSocket } = require('./config/socket');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  // Wait for MongoDB to connect
  await connectDB();

  // Create Node HTTP server
  const server = http.createServer(app);

  // Inject Socket.io configuration
  initSocket(server);

  // Start listening
  server.listen(PORT, () => {
    console.log(`========================================================================`);
    console.log(`🚀 Server successfully running on PORT: ${PORT}`);
    console.log(`📁 MongoDB synced and connected`);
    console.log(`🔌 WebSockets connected and active`);
    console.log(`========================================================================`);
  });

  // Process error hooks
  process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION! 💥 Server shutting down...');
    console.error(err);
    server.close(() => {
      process.exit(1);
    });
  });

  process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION! 💥 Server shutting down...');
    console.error(err);
    process.exit(1);
  });
};

startServer();
