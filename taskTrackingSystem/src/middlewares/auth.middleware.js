const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { UnauthorizedError } = require('../utils/customErrors');

const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new UnauthorizedError('Not authorized, token missing'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id);

      if (!user) {
        return next(new UnauthorizedError('Not authorized, user no longer exists'));
      }

      req.user = user.toJSON();
      next();
    } catch (err) {
      return next(new UnauthorizedError('Not authorized, invalid or expired token'));
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { protect };
