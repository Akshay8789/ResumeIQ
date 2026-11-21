'use strict';

/**
 * Centralized error handling middleware.
 * Produces a consistent JSON error response.
 */
const errorHandler = (err, req, res, _next) => {
  // Never log sensitive fields
  const safeLog = {
    method: req.method,
    url: req.originalUrl,
    status: err.status || err.statusCode || 500,
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  };
  console.error('[Error]', safeLog);

  const status = err.status || err.statusCode || 500;
  const isProduction = process.env.NODE_ENV === 'production';

  res.status(status).json({
    success: false,
    message:
      status < 500
        ? err.message
        : isProduction
        ? 'An internal server error occurred.'
        : err.message,
    errors: err.errors || undefined,
  });
};

module.exports = errorHandler;
