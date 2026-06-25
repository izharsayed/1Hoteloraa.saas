"use strict";Object.defineProperty(exports, "__esModule", {value: true});var _zod = require('zod');

 const addFolioItemSchema = _zod.z.object({
  paymentId: _zod.z.string().uuid('paymentId must be a valid UUID'),
  description: _zod.z.string().min(1, 'description is required').max(500),
  amount: _zod.z.number().positive('amount must be positive'),
  type: _zod.z.enum(['CHARGE', 'PAYMENT', 'DISCOUNT']),
}); exports.addFolioItemSchema = addFolioItemSchema;


