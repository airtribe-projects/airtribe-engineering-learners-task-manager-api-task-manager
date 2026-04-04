const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const PricingRule = sequelize.define('PricingRule', {
  vehicleType: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  baseFee: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  hourlyRate: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

module.exports = PricingRule;