const { v4: uuidv4 } = require('uuid');
const { allocateSpot, releaseSpot } = require('./allocationService');
const { calculateFee } = require('./feeService');

async function checkIn(vehicleNumber, vehicleType) {
  await Vehicle.findOrCreate({
    where: { vehicleNumber },
    defaults: { vehicleType },
  });

  const spot = await allocateSpot(vehicleType);

  const ticket = await ParkingTicket.create({
    ticketNumber: `TICKET-${Date.now()}`,
    vehicleNumber,
    spotId: spot.id,
    entryTime: new Date(),
    status: 'ACTIVE',
  });

  return {
    ticketId: ticket.id,
    ticketNumber: ticket.ticketNumber,
    floor: spot.floorNumber,
    spotNumber: spot.spotNumber,
    entryTime: ticket.entryTime,
  };
}

async function checkOut(ticketId) {
  const ticket = await ParkingTicket.findByPk(ticketId);

  if (!ticket) throw new Error('Ticket not found');

  if (ticket.status === 'CLOSED') {
    return ticket;
  }

  const exitTime = new Date();

  const vehicle = await Vehicle.findByPk(ticket.vehicleNumber);

  const fee = await calculateFee(
    vehicle.vehicleType,
    ticket.entryTime,
    exitTime
  );

  ticket.exitTime = exitTime;
  ticket.fee = fee;
  ticket.status = 'CLOSED';

  await ticket.save();

  await releaseSpot(ticket.spotId);

  return {
    ticketId: ticket.id,
    exitTime,
    fee,
  };
}

module.exports = {
  checkIn,
  checkOut,
};