const parkingService = require('../services/parkingService');
const ParkingSpot = require('../models/ParkingSpot');

exports.checkIn = async (req, res) => {
  try {
    const { vehicleNumber, vehicleType } = req.body;

    const result = await parkingService.checkIn(
      vehicleNumber,
      vehicleType
    );

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.checkOut = async (req, res) => {
  try {
    const { ticketId } = req.body;

    const result = await parkingService.checkOut(ticketId);

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAvailability = async (req, res) => {
  try {
    const spots = await ParkingSpot.findAll({
      where: { status: 'AVAILABLE' },
    });

    res.status(200).json(spots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};