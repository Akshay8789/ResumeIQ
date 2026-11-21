'use strict';

const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Verifies the JWT from the HttpOnly cookie and attaches req.user.
 */
const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies[process.env.COOKIE_NAME || 'resumeiq_token'];

    if (!token) {
      const err = new Error('Authentication required. Please log in.');
      err.status = 401;
      return next(err);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      const err = new Error('User not found. Please log in again.');
      err.status = 401;
      return next(err);
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      const authErr = new Error('Invalid or expired session. Please log in again.');
      authErr.status = 401;
      return next(authErr);
    }
    next(err);
  }
};

module.exports = { authenticate };
