import express from 'express';
import routes from './routes';
import { ApiResponse } from './types/Task';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/', routes);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  const response: ApiResponse = {
    success: false,
    status: 500,
    message: 'Something went wrong!'
  };
  res.status(500).json(response);
});

// 404 handler
app.use('*', (req: express.Request, res: express.Response) => {
  const response: ApiResponse = {
    success: false,
    status: 404,
    message: 'Route not found'
  };
  res.status(404).json(response);
});

// Start server only if this file is run directly
if (require.main === module) {
  app.listen(port, (err?: Error) => {
    if (err) {
      return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on port ${port}`);
  });
}

export default app;
