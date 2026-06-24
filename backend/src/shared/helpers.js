"use strict";Object.defineProperty(exports, "__esModule", {value: true});

 const sendSuccess = (
  res,
  data,
  message = 'Success',
  statusCode = 200
) => {
  return res.status(statusCode).json({ success: true, message, data });
}; exports.sendSuccess = sendSuccess;

 const sendError = (
  res,
  message = 'Error',
  statusCode = 400,
  errors
) => {
  return res.status(statusCode).json({ success: false, message, errors });
}; exports.sendError = sendError;

 const paginate = (page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  return { skip, take: limit };
}; exports.paginate = paginate;

 const generateOrderNumber = (prefix = 'ORD') => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}; exports.generateOrderNumber = generateOrderNumber;

 const generateBookingRef = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `BKG-${timestamp}-${random}`;
}; exports.generateBookingRef = generateBookingRef;

 const generateKOTNumber = (prefix = 'KOT') => {
  const timestamp = Date.now().toString(36).toUpperCase();
  return `${prefix}-${timestamp}`;
}; exports.generateKOTNumber = generateKOTNumber;
