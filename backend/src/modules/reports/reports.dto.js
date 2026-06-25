"use strict";Object.defineProperty(exports, "__esModule", {value: true});var _zod = require('zod');

 const reportQuerySchema = _zod.z.object({
  type: _zod.z.enum(['DAILY_SALES', 'OCCUPANCY', 'INVENTORY', 'REVENUE']),
  startDate: _zod.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'startDate must be in format YYYY-MM-DD').optional(),
  endDate: _zod.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'endDate must be in format YYYY-MM-DD').optional(),
}); exports.reportQuerySchema = reportQuerySchema;


