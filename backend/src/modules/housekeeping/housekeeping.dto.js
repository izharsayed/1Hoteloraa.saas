"use strict";Object.defineProperty(exports, "__esModule", {value: true});var _zod = require('zod');

 const createTaskSchema = _zod.z.object({
  roomId: _zod.z.string().uuid({ message: 'Invalid room ID' }),
  assignedTo: _zod.z.string().uuid({ message: 'Invalid user ID' }).optional(),
  taskType: _zod.z.enum(['CLEANING', 'INSPECTION', 'MAINTENANCE', 'TURNDOWN'], {
    errorMap: () => ({ message: 'taskType must be CLEANING, INSPECTION, MAINTENANCE, or TURNDOWN' }),
  }),
  notes: _zod.z.string().max(1000).optional(),
  scheduledAt: _zod.z.string().datetime({ message: 'scheduledAt must be a valid ISO datetime string' }).optional(),
}); exports.createTaskSchema = createTaskSchema;

 const updateTaskSchema = _zod.z.object({
  roomId: _zod.z.string().uuid({ message: 'Invalid room ID' }).optional(),
  assignedTo: _zod.z.string().uuid({ message: 'Invalid user ID' }).optional().nullable(),
  taskType: _zod.z
    .enum(['CLEANING', 'INSPECTION', 'MAINTENANCE', 'TURNDOWN'], {
      errorMap: () => ({ message: 'taskType must be CLEANING, INSPECTION, MAINTENANCE, or TURNDOWN' }),
    })
    .optional(),
  notes: _zod.z.string().max(1000).optional().nullable(),
  scheduledAt: _zod.z
    .string()
    .datetime({ message: 'scheduledAt must be a valid ISO datetime string' })
    .optional()
    .nullable(),
}); exports.updateTaskSchema = updateTaskSchema;

 const updateStatusSchema = _zod.z.object({
  status: _zod.z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'INSPECTED'], {
    errorMap: () => ({
      message: 'status must be PENDING, IN_PROGRESS, COMPLETED, or INSPECTED',
    }),
  }),
}); exports.updateStatusSchema = updateStatusSchema;




