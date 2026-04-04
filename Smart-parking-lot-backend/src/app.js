const express = require('express');
const parkingRoutes = require('./routes/parkingRoutes');

const app = express();

app.use(express.json());
app.use('/api/parking', parkingRoutes);

module.exports = app;