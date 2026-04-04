const ParkingSpot = require('../models/ParkingSpot');

function getAllowedSpotTypes(vehicleType) {
  switch (vehicleType) {
    case 'MOTORCYCLE':
      return ['MOTORCYCLE', 'COMPACT', 'LARGE'];
    case 'CAR':
      return ['COMPACT', 'LARGE'];
    case 'BUS':
      return ['LARGE'];
    default:
      throw new Error('Invalid vehicle type');
  }
}

async function allocateSpot(vehicleType) {
  const allowedSpotTypes = getAllowedSpotTypes(vehicleType);

  for (const spotType of allowedSpotTypes) {
    const spot = await ParkingSpot.findOne({
      where: {
        spotType,
        status: 'AVAILABLE',
      },
      order: [
        ['floorNumber', 'ASC'],
        ['spotNumber', 'ASC'],
      ],
    });

    if (spot) {
      spot.status = 'OCCUPIED';
      await spot.save();
      return spot;
    }
  }

  throw new Error('No parking spot available');
}

async function releaseSpot(spotId) {
  const spot = await ParkingSpot.findByPk(spotId);

  if (!spot) throw new Error('Spot not found');

  spot.status = 'AVAILABLE';
  await spot.save();
}

module.exports = {
  allocateSpot,
  releaseSpot,
};