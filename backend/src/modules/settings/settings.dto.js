"use strict";Object.defineProperty(exports, "__esModule", {value: true});var _zod = require('zod');

 const updateSettingsSchema = _zod.z.object({
  taxRate: _zod.z.number().min(0).max(100).optional(),
  serviceCharge: _zod.z.number().min(0).max(100).optional(),
  invoicePrefix: _zod.z.string().min(1).max(10).optional(),
  kotPrefix: _zod.z.string().min(1).max(10).optional(),
  bookingPrefix: _zod.z.string().min(1).max(10).optional(),
  footerNote: _zod.z.string().max(1000).optional(),
  smtpHost: _zod.z.string().optional(),
  smtpPort: _zod.z.number().optional(),
  smtpUser: _zod.z.string().optional(),
  smtpPass: _zod.z.string().optional(),
  smsProvider: _zod.z.string().optional(),
  smsApiKey: _zod.z.string().optional(),
}); exports.updateSettingsSchema = updateSettingsSchema;


