"use strict";Object.defineProperty(exports, "__esModule", {value: true});var _zod = require('zod');

// Mirrors the Prisma InventoryUnit enum
const inventoryUnitValues = [
  'KG',
  'GRAM',
  'LITRE',
  'ML',
  'PIECE',
  'PACKET',
  'BOX',
  'DOZEN',
  'BOTTLE',
] ;

 const createItemSchema = _zod.z.object({
  name: _zod.z
    .string()
    .min(1, 'Name is required')
    .max(200, 'Name must not exceed 200 characters'),
  description: _zod.z.string().max(1000).optional(),
  sku: _zod.z.string().max(100).optional(),
  unit: _zod.z.enum(inventoryUnitValues, {
    errorMap: () => ({
      message: `unit must be one of: ${inventoryUnitValues.join(', ')}`,
    }),
  }),
  quantity: _zod.z.number().min(0, 'Quantity must be 0 or greater').default(0),
  minimumStock: _zod.z.number().min(0, 'Minimum stock must be 0 or greater').default(0),
  costPrice: _zod.z.number().min(0, 'Cost price must be 0 or greater').default(0),
}); exports.createItemSchema = createItemSchema;

 const updateItemSchema = _zod.z.object({
  name: _zod.z.string().min(1).max(200).optional(),
  description: _zod.z.string().max(1000).optional().nullable(),
  sku: _zod.z.string().max(100).optional().nullable(),
  unit: _zod.z
    .enum(inventoryUnitValues, {
      errorMap: () => ({
        message: `unit must be one of: ${inventoryUnitValues.join(', ')}`,
      }),
    })
    .optional(),
  quantity: _zod.z.number().min(0).optional(),
  minimumStock: _zod.z.number().min(0).optional(),
  costPrice: _zod.z.number().min(0).optional(),
}); exports.updateItemSchema = updateItemSchema;

 const adjustStockSchema = _zod.z.object({
  quantity: _zod.z
    .number({ required_error: 'quantity is required' })
    .refine((v) => v !== 0, { message: 'quantity adjustment cannot be zero' }),
  reason: _zod.z
    .string()
    .min(1, 'reason is required')
    .max(500, 'reason must not exceed 500 characters'),
}); exports.adjustStockSchema = adjustStockSchema;




