"use strict";Object.defineProperty(exports, "__esModule", {value: true});var _zod = require('zod');

 const createVendorSchema = _zod.z.object({
  name: _zod.z.string().min(1, 'Vendor name is required').max(150),
  email: _zod.z.string().email('Invalid email').optional(),
  phone: _zod.z.string().max(20).optional(),
  address: _zod.z.string().max(500).optional(),
  gstin: _zod.z
    .string()
    .max(15)
    .regex(/^[A-Z0-9]+$/, 'Invalid GSTIN format')
    .optional(),
  contactName: _zod.z.string().max(100).optional(),
}); exports.createVendorSchema = createVendorSchema;

 const updateVendorSchema = exports.createVendorSchema.partial(); exports.updateVendorSchema = updateVendorSchema;



