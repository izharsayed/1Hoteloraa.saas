"use strict";Object.defineProperty(exports, "__esModule", {value: true});var _zod = require('zod');

// ---------------------------------------------------------------------------
// Create Order
// ---------------------------------------------------------------------------
 const createOrderSchema = _zod.z.object({
  tableId: _zod.z.string().uuid('Invalid table ID').optional(),
  items: _zod.z
    .array(
      _zod.z.object({
        menuItemId: _zod.z.string().uuid('Invalid menu item ID'),
        quantity: _zod.z.number().int().positive('Quantity must be a positive integer'),
        notes: _zod.z.string().optional(),
      })
    )
    .min(1, 'At least one item is required'),
  notes: _zod.z.string().optional(),
}); exports.createOrderSchema = createOrderSchema;



// ---------------------------------------------------------------------------
// Update Order Status
// ---------------------------------------------------------------------------
 const updateOrderStatusSchema = _zod.z.object({
  status: _zod.z.enum(['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'SERVED', 'CANCELLED', 'COMPLETED'], {
    required_error: 'Status is required',
    invalid_type_error: 'Invalid order status',
  }),
}); exports.updateOrderStatusSchema = updateOrderStatusSchema;



// ---------------------------------------------------------------------------
// Add Items to Order
// ---------------------------------------------------------------------------
 const addItemsSchema = _zod.z.object({
  items: _zod.z
    .array(
      _zod.z.object({
        menuItemId: _zod.z.string().uuid('Invalid menu item ID'),
        quantity: _zod.z.number().int().positive('Quantity must be a positive integer'),
        notes: _zod.z.string().optional(),
      })
    )
    .min(1, 'At least one item is required'),
}); exports.addItemsSchema = addItemsSchema;


