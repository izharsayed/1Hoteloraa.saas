import { z } from 'zod';

export const createTableSchema = z.object({
  name: z.string().min(1).max(50),
  capacity: z.number().int().positive().default(4),
  floor: z.string().max(50).optional(),
  section: z.string().max(50).optional(),
});

export const updateTableSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  capacity: z.number().int().positive().optional(),
  floor: z.string().max(50).optional(),
  section: z.string().max(50).optional(),
});

export const updateTableStatusSchema = z.object({
  status: z.enum(['AVAILABLE', 'OCCUPIED', 'RESERVED', 'CLEANING']),
});

export type CreateTableDto = z.infer<typeof createTableSchema>;
export type UpdateTableDto = z.infer<typeof updateTableSchema>;
export type UpdateTableStatusDto = z.infer<typeof updateTableStatusSchema>;
