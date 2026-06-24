"use strict";Object.defineProperty(exports, "__esModule", {value: true});var _zod = require('zod');

 const checkInSchema = _zod.z.object({
  reservationId: _zod.z.string().uuid({ message: 'reservationId must be a valid UUID' }),
  notes: _zod.z.string().max(1000).optional(),
}); exports.checkInSchema = checkInSchema;


