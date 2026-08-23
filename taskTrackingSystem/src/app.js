const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const globalErrorHandler = require('./middlewares/error.middleware');
const { NotFoundError } = require('./utils/customErrors');

// Import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const teamRoutes = require('./routes/team.routes');
const taskRoutes = require('./routes/task.routes');
const commentRoutes = require('./routes/comment.routes');
const { nestedRouter: attachmentNestedRouter, globalRouter: attachmentGlobalRouter } = require('./routes/attachment.routes');
const aiRoutes = require('./routes/ai.routes');

const app = express();

// Global Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploads folder static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API Routes Mounting
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/tasks', taskRoutes);

// Nested routes mounting (comments and attachments under specific tasks)
app.use('/api/tasks/:taskId/comments', commentRoutes);
app.use('/api/tasks/:taskId/attachments', attachmentNestedRouter);

// Global attachment endpoint (direct download API)
app.use('/api/attachments', attachmentGlobalRouter);

// Generative AI tools endpoint
app.use('/api/ai', aiRoutes);

// Handle unknown route attempts
app.all('*', (req, res, next) => {
  next(new NotFoundError(`The requested endpoint [${req.method}] ${req.originalUrl} was not found`));
});

// Error handling middleware
app.use(globalErrorHandler);

module.exports = app;
