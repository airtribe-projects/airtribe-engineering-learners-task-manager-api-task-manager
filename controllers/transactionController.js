const Transaction = require('../models/transactionModel');
const { logTransaction } = require('../utils/fileLogger');

const createTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.create(req.body);
    res.status(201).json({ message: 'Transaction created', transaction });
  } catch (err) {
    next(err);
  }
};

const getAllTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find().sort({ date: -1 });
    res.status(200).json({ count: transactions.length, transactions });
  } catch (err) {
    next(err);
  }
};

const getTransactionById = async (req, res, next) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.status(200).json({ transaction });
  } catch (err) {
    next(err);
  }
};

const updateTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.status(200).json({ message: 'Transaction updated', transaction });
  } catch (err) {
    next(err);
  }
};

const deleteTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.status(200).json({ message: 'Transaction deleted' });
  } catch (err) {
    next(err);
  }
};

const getSummary = async (req, res, next) => {
  try {
    const result = await Transaction.aggregate([
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
        },
      },
    ]);

    const summary = { income: 0, expense: 0, balance: 0 };
    result.forEach(({ _id, total }) => {
      summary[_id] = total;
    });
    summary.balance = summary.income - summary.expense;

    res.status(200).json({ summary });
  } catch (err) {
    next(err);
  }
};

const createTransactionfile = async (req, res, next) => {
  try {
    const transaction = await Transaction.create(req.body);
    await logTransaction('CREATE', transaction); // ✅ logs to file
    res.status(201).json({ message: 'Transaction created', transaction });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  getSummary,
  createTransactionfile
};