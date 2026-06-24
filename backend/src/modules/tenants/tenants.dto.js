"use strict";Object.defineProperty(exports, "__esModule", {value: true});var _zod = require('zod');

 const updateTenantSchema = _zod.z.object({
  name: _zod.z.string().min(2, 'Name must be at least 2 characters').optional(),
  phone: _zod.z.string().optional(),
  email: _zod.z.string().email('Invalid email address').optional(),
  address: _zod.z.string().optional(),
  city: _zod.z.string().optional(),
  state: _zod.z.string().optional(),
  country: _zod.z.string().optional(),
  logoUrl: _zod.z.string().url('Invalid logo URL').optional(),
  currency: _zod.z.string().length(3, 'Currency must be a 3-letter code').optional(),
  timezone: _zod.z.string().optional(),
}); exports.updateTenantSchema = updateTenantSchema;


