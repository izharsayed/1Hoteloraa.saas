"use strict";Object.defineProperty(exports, "__esModule", {value: true});var _zod = require('zod');

 const createPurchaseSchema = _zod.z.object({
  vendorId: _zod.z.string().uuid('Invalid vendor ID').optional(),
  items: _zod.z
    .array(
      _zod.z.object({
        inventoryItemId: _zod.z.string().uuid('Invalid inventory item ID'),
        quantity: _zod.z.number().positive('Quantity must be positive'),
        unitPrice: _zod.z.number().min(0, 'Unit price cannot be negative'),
      })
    )
    .min(1, 'At least one purchase item is required'),
  notes: _zod.z.string().max(1000).optional(),
}); exports.createPurchaseSchema = createPurchaseSchema;

 const updatePurchaseStatusSchema = _zod.z.object({
  status: _zod.z.enum(['PENDING', 'RECEIVED', 'PARTIAL', 'CANCELLED'], {
    required_error: 'Status is required',
    invalid_type_error: 'Invalid purchase status',
  }),
}); exports.updatePurchaseStatusSchema = updatePurchaseStatusSchema;



