"use strict";Object.defineProperty(exports, "__esModule", {value: true});var _zod = require('zod');

// ---------------------------------------------------------------------------
// Generate Bill
// ---------------------------------------------------------------------------
 const generateBillSchema = _zod.z.object({
  orderId: _zod.z.string().uuid('Invalid order ID'),
  discountAmount: _zod.z
    .number()
    .min(0, 'Discount cannot be negative')
    .optional()
    .default(0),
  paymentMethod: _zod.z.enum(
    ['CASH', 'CARD', 'UPI', 'BANK_TRANSFER', 'WALLET', 'CREDIT'],
    {
      required_error: 'Payment method is required',
      invalid_type_error: 'Invalid payment method',
    }
  ),
  reference: _zod.z.string().max(200).optional(),
  notes: _zod.z.string().max(1000).optional(),
}); exports.generateBillSchema = generateBillSchema;


