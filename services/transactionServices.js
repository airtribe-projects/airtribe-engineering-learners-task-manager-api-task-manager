const Transaction = require('../models/transactionModel');

const getSummaryService = async () => {
  const result = await Transaction.aggregate([
    { $group: { _id: '$type', total: { $sum: '$amount' } } },
  ]);
  const summary = { income: 0, expense: 0, balance: 0 };
  result.forEach(({ _id, total }) => (summary[_id] = total));
  summary.balance = summary.income - summary.expense;
  return summary;
};

module.exports = { getSummaryService };