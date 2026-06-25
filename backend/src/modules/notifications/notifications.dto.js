"use strict";Object.defineProperty(exports, "__esModule", {value: true});var _zod = require('zod');

 const createNotificationSchema = _zod.z.object({
  userId: _zod.z.string().uuid().optional().nullable(),
  role: _zod.z.string().optional().nullable(),
  title: _zod.z.string().min(1).max(100),
  message: _zod.z.string().min(1).max(500),
  type: _zod.z.enum(['INFO', 'SUCCESS', 'WARNING', 'DANGER']).default('INFO'),
}); exports.createNotificationSchema = createNotificationSchema;


