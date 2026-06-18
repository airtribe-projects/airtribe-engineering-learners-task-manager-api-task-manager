const {body, validationResult} = require('express-validator')

const validate = (req , res ,next) =>{
    const error = validationResult(req);
    if(!error.isEmpty){
        return res.status(400).json({
            error:error.array()
        })
    }
    next()
}
const registerRules = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email format'),
    body('password').notEmpty().withMessage('Password is required').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const loginRules = [
    body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email format'),
    body('password').notEmpty().withMessage('Password is required'),
];

const validateTransaction = (req, res, next) => {
  const { type, category, amount, date } = req.body;
  const errors = [];

  if (!type || !['income', 'expense'].includes(type)) {
    errors.push('type must be "income" or "expense"');
  }
  if (!category || typeof category !== 'string') {
    errors.push('category is required');
  }
  if (amount === undefined || typeof amount !== 'number' || amount < 0) {
    errors.push('amount must be a positive number');
  }
  if (!date || isNaN(new Date(date))) {
    errors.push('date is required and must be valid');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};


module.exports = {validate,registerRules,loginRules,validateTransaction}