"use strict";Object.defineProperty(exports, "__esModule", {value: true});var _zod = require('zod');

 const createRoomTypeSchema = _zod.z.object({
  name: _zod.z.string().min(1, 'Name is required').max(100),
  description: _zod.z.string().max(500).optional(),
  basePrice: _zod.z.number({ required_error: 'Base price is required' }).positive('Base price must be positive'),
  maxOccupancy: _zod.z.number().int().positive().default(2),
  amenities: _zod.z.array(_zod.z.string().min(1)).optional().default([]),
  imageUrl: _zod.z.string().url('Invalid image URL').optional(),
}); exports.createRoomTypeSchema = createRoomTypeSchema;

 const updateRoomTypeSchema = _zod.z.object({
  name: _zod.z.string().min(1).max(100).optional(),
  description: _zod.z.string().max(500).optional(),
  basePrice: _zod.z.number().positive('Base price must be positive').optional(),
  maxOccupancy: _zod.z.number().int().positive().optional(),
  amenities: _zod.z.array(_zod.z.string().min(1)).optional(),
  imageUrl: _zod.z.string().url('Invalid image URL').optional(),
}); exports.updateRoomTypeSchema = updateRoomTypeSchema;



