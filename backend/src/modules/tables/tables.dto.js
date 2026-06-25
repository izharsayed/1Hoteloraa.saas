"use strict";Object.defineProperty(exports, "__esModule", {value: true});var _zod = require('zod');

 const createTableSchema = _zod.z.object({
  name: _zod.z.string().min(1).max(50),
  capacity: _zod.z.number().int().positive().default(4),
  floor: _zod.z.string().max(50).optional(),
  section: _zod.z.string().max(50).optional(),
}); exports.createTableSchema = createTableSchema;

 const updateTableSchema = _zod.z.object({
  name: _zod.z.string().min(1).max(50).optional(),
  capacity: _zod.z.number().int().positive().optional(),
  floor: _zod.z.string().max(50).optional(),
  section: _zod.z.string().max(50).optional(),
}); exports.updateTableSchema = updateTableSchema;

 const updateTableStatusSchema = _zod.z.object({
  status: _zod.z.enum(['AVAILABLE', 'OCCUPIED', 'RESERVED', 'CLEANING']),
}); exports.updateTableStatusSchema = updateTableStatusSchema;




