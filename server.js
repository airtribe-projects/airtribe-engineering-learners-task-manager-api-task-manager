const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();



const app = express();
app.use(express.json());

const authRoutes = require('./routes/auth.routes');
app.use('/api', authRoutes);

const preferencesRoutes = require('./routes/preferences.routes');
app.use('/api/preferences', preferencesRoutes);

const newsRoutes = require('./routes/news.routes');
app.use('/api/news', newsRoutes);

console.log(' Connecting to MongoDB...')

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT, () =>
      console.log(`Server running on port ${process.env.PORT}`)
    );
  })
  .catch(err => console.error('MongoDB connection failed:', err));
