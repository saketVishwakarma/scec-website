/**
 * Centralized error handler.
 * Catches: Mongoose validation errors, duplicate key errors,
 * CastErrors (bad ObjectId), Multer errors, and generic errors.
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  let statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === 'development') {
    console.error('🔴 Error:', err);
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    statusCode = 404;
    error.message = `Resource not found with id of ${err.value}`;
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    error.message = `Duplicate value entered for ${field}. Please use another value.`;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    error.message = Object.values(err.errors).map((val) => val.message).join(', ');
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    error.message = 'Invalid token';
  }
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    error.message = 'Token expired, please login again';
  }

  // Multer file size error
  if (err.code === 'LIMIT_FILE_SIZE') {
    statusCode = 400;
    error.message = 'File too large. Maximum size allowed is 5MB.';
  }

  res.status(statusCode).json({
    success: false,
    message: error.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
