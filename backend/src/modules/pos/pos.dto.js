"use strict";Object.defineProperty(exports, "__esModule", {value: true});var _zod = require('zod');

 const quickOrderSchema = _zod.z.object({
  tableId: _zod.z.string().uuid().optional().nullable(),
  items: _zod.z.array(
    _zod.z.object({
      menuItemId: _zod.z.string().uuid('menuItemId must be a valid UUID'),
      quantity: _zod.z.number().int().positive('Quantity must be at least 1'),
      notes: _zod.z.string().max(500).optional().nullable(),
    })
  ).min(1, 'Order must contain at least 1 item'),
}); exports.quickOrderSchema = quickOrderSchema;


