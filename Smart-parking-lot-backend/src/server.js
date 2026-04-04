require('dotenv').config();

const sequelize = require('./config/database');

const Vehicle = require('./models/Vehicle');
const ParkingSpot = require('./models/ParkingSpot');
const ParkingTicket = require('./models/ParkingTicket');
const PricingRule = require('./models/PricingRule');

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Database connected');

    await sequelize.sync({ alter: true });

    const existingPricing = await PricingRule.count();

    if (existingPricing === 0) {
      await PricingRule.bulkCreate([
        {
          vehicleType: 'MOTORCYCLE',
          baseFee: 10,
          hourlyRate: 5,
        },
        {
          vehicleType: 'CAR',
          baseFee: 20,
          hourlyRate: 15,
        },
        {
          vehicleType: 'BUS',
          baseFee: 50,
          hourlyRate: 40,
        },
      ]);

      console.log('Pricing rules seeded');
    }

    const existingSpots = await ParkingSpot.count();

    if (existingSpots === 0) {
      await ParkingSpot.bulkCreate([
        {
          floorNumber: 1,
          spotNumber: 'M1',
          spotType: 'MOTORCYCLE',
        },
        {
          floorNumber: 1,
          spotNumber: 'C1',
          spotType: 'COMPACT',
        },
        {
          floorNumber: 1,
          spotNumber: 'L1',
          spotType: 'LARGE',
        },
        {
          floorNumber: 2,
          spotNumber: 'C2',
          spotType: 'COMPACT',
        },
      ]);

      console.log('Parking spots seeded');
    }

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
}

startServer();