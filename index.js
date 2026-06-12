

require("dotenv").config(); 

const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const mongoose = require("mongoose");
const express = require("express");  
const connectDB = require("./db");
const app = express();
const PORT = 3000;

// const tasksData = require('./task.json');
// const validateTask = require('./utils/validateTask');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

console.log("MONGO_URI:", process.env.MONGO_URI);
console.log("JWT:", process.env.JWT_SECRET);
connectDB();

const authRoutes = require('./routes/userRoute')
const transactionRoutes = require('./routes/transactionRoutes');
const {protect} = require('./middleware/authMiddleware')
const logger = require('./middleware/logger');
const validateTransaction = require('./middleware/validateMiddleware');
const errorHandler = require('./middleware/errorHandle');

app.use('/transactions', protect, transactionRoutes);
app.use('/users',authRoutes);
app.use(logger);


app.get('/', (req, res) => {
  res.send('FinEdge API is running');
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

//  GET /tasks: Retrieve all tasks.

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
module.exports = app;