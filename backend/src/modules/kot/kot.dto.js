"use strict";Object.defineProperty(exports, "__esModule", {value: true});var _zod = require('zod');

// ---------------------------------------------------------------------------
// Create KOT
// ---------------------------------------------------------------------------
 const createKOTSchema = _zod.z.object({
  orderId: _zod.z.string().uuid('Invalid order ID'),
  itemIds: _zod.z
    .array(_zod.z.string().uuid('Invalid order item ID'))
    .min(1, 'At least one order item ID is required'),
  notes: _zod.z.string().optional(),
}); exports.createKOTSchema = createKOTSchema;



// ---------------------------------------------------------------------------
// Update KOT Status
// ---------------------------------------------------------------------------
 const updateKOTStatusSchema = _zod.z.object({
  status: _zod.z.enum(['PENDING', 'IN_PROGRESS', 'READY', 'CANCELLED'], {
    required_error: 'Status is required',
    invalid_type_error: 'Invalid KOT status',
  }),
}); exports.updateKOTStatusSchema = updateKOTStatusSchema;


