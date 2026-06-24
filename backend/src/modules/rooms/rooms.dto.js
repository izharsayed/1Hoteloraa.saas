"use strict";Object.defineProperty(exports, "__esModule", {value: true});var _zod = require('zod');

 const createRoomSchema = _zod.z.object({
  roomTypeId: _zod.z.string().uuid('Invalid room type ID'),
  number: _zod.z.string().min(1, 'Room number is required').max(20),
  floor: _zod.z.string().max(20).optional(),
  description: _zod.z.string().max(500).optional(),
}); exports.createRoomSchema = createRoomSchema;

 const updateRoomSchema = _zod.z.object({
  number: _zod.z.string().min(1).max(20).optional(),
  floor: _zod.z.string().max(20).optional(),
  description: _zod.z.string().max(500).optional(),
}); exports.updateRoomSchema = updateRoomSchema;

 const updateRoomStatusSchema = _zod.z.object({
  status: _zod.z.enum(
    ['AVAILABLE', 'OCCUPIED', 'RESERVED', 'MAINTENANCE', 'CHECKOUT_PENDING', 'CLEANING'],
    { required_error: 'Status is required' }
  ),
}); exports.updateRoomStatusSchema = updateRoomStatusSchema;




