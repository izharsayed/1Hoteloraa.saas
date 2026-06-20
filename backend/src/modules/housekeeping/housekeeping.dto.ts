import { z } from 'zod';

export const createTaskSchema = z.object({
  roomId: z.string().uuid({ message: 'Invalid room ID' }),
  assignedTo: z.string().uuid({ message: 'Invalid user ID' }).optional(),
  taskType: z.enum(['CLEANING', 'INSPECTION', 'MAINTENANCE', 'TURNDOWN'], {
    errorMap: () => ({ message: 'taskType must be CLEANING, INSPECTION, MAINTENANCE, or TURNDOWN' }),
  }),
  notes: z.string().max(1000).optional(),
  scheduledAt: z.string().datetime({ message: 'scheduledAt must be a valid ISO datetime string' }).optional(),
});

export const updateTaskSchema = z.object({
  roomId: z.string().uuid({ message: 'Invalid room ID' }).optional(),
  assignedTo: z.string().uuid({ message: 'Invalid user ID' }).optional().nullable(),
  taskType: z
    .enum(['CLEANING', 'INSPECTION', 'MAINTENANCE', 'TURNDOWN'], {
      errorMap: () => ({ message: 'taskType must be CLEANING, INSPECTION, MAINTENANCE, or TURNDOWN' }),
    })
    .optional(),
  notes: z.string().max(1000).optional().nullable(),
  scheduledAt: z
    .string()
    .datetime({ message: 'scheduledAt must be a valid ISO datetime string' })
    .optional()
    .nullable(),
});

export const updateStatusSchema = z.object({
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'INSPECTED'], {
    errorMap: () => ({
      message: 'status must be PENDING, IN_PROGRESS, COMPLETED, or INSPECTED',
    }),
  }),
});

export type CreateTaskDto = z.infer<typeof createTaskSchema>;
export type UpdateTaskDto = z.infer<typeof updateTaskSchema>;
export type UpdateStatusDto = z.infer<typeof updateStatusSchema>;
