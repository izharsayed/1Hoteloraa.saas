import { Response } from 'express';

export const sendSuccess = (
  res: Response,
  data: unknown,
  message = 'Success',
  statusCode = 200
): Response => {
  return res.status(statusCode).json({ success: true, message, data });
};

export const sendError = (
  res: Response,
  message = 'Error',
  statusCode = 400,
  errors?: unknown
): Response => {
  return res.status(statusCode).json({ success: false, message, errors });
};

export const paginate = (page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  return { skip, take: limit };
};

export const generateOrderNumber = (prefix = 'ORD'): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};

export const generateBookingRef = (): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `BKG-${timestamp}-${random}`;
};

export const generateKOTNumber = (prefix = 'KOT'): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  return `${prefix}-${timestamp}`;
};
