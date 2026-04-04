const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ParkingSpot = sequelize.define('ParkingSpot', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  floorNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  spotNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  spotType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'AVAILABLE',
  },
});

module.exports = ParkingSpot;