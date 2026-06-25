"use strict";Object.defineProperty(exports, "__esModule", {value: true});






 const errorHandler = (
  err,
  _req,
  res,
  _next
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}; exports.errorHandler = errorHandler;

 const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
}; exports.notFound = notFound;

 const createError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.isOperational = true;
  return error;
}; exports.createError = createError;
