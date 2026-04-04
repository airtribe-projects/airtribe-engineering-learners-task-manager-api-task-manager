const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Vehicle = sequelize.define('Vehicle', {
  vehicleNumber: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  vehicleType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Vehicle;