const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ParkingTicket = sequelize.define('ParkingTicket', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  ticketNumber: {
    type: DataTypes.STRING,
    unique: true,
  },
  vehicleNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  spotId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  entryTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  exitTime: {
    type: DataTypes.DATE,
  },
  fee: {
    type: DataTypes.FLOAT,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'ACTIVE',
  },
});

module.exports = ParkingTicket;