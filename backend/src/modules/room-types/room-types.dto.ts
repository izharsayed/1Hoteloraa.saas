import { z } from 'zod';

export const createRoomTypeSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().max(500).optional(),
  basePrice: z.number({ required_error: 'Base price is required' }).positive('Base price must be positive'),
  maxOccupancy: z.number().int().positive().default(2),
  amenities: z.array(z.string().min(1)).optional().default([]),
  imageUrl: z.string().url('Invalid image URL').optional(),
});

export const updateRoomTypeSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  basePrice: z.number().positive('Base price must be positive').optional(),
  maxOccupancy: z.number().int().positive().optional(),
  amenities: z.array(z.string().min(1)).optional(),
  imageUrl: z.string().url('Invalid image URL').optional(),
});

export type CreateRoomTypeDto = z.infer<typeof createRoomTypeSchema>;
export type UpdateRoomTypeDto = z.infer<typeof updateRoomTypeSchema>;
