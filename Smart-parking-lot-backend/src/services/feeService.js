const PricingRule = require('../models/PricingRule');

async function calculateFee(vehicleType, entryTime, exitTime) {
  const pricing = await PricingRule.findByPk(vehicleType);

  if (!pricing) throw new Error('Pricing rule not found');

  const durationMs = new Date(exitTime) - new Date(entryTime);
  const hours = Math.max(1, Math.ceil(durationMs / (1000 * 60 * 60)));

  return pricing.baseFee + hours * pricing.hourlyRate;
}

module.exports = {
  calculateFee,
};