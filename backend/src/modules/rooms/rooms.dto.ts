import { z } from 'zod';

export const createRoomSchema = z.object({
  roomTypeId: z.string().uuid('Invalid room type ID'),
  number: z.string().min(1, 'Room number is required').max(20),
  floor: z.string().max(20).optional(),
  description: z.string().max(500).optional(),
});

export const updateRoomSchema = z.object({
  number: z.string().min(1).max(20).optional(),
  floor: z.string().max(20).optional(),
  description: z.string().max(500).optional(),
});

export const updateRoomStatusSchema = z.object({
  status: z.enum(
    ['AVAILABLE', 'OCCUPIED', 'RESERVED', 'MAINTENANCE', 'CHECKOUT_PENDING', 'CLEANING'],
    { required_error: 'Status is required' }
  ),
});

export type CreateRoomDto = z.infer<typeof createRoomSchema>;
export type UpdateRoomDto = z.infer<typeof updateRoomSchema>;
export type UpdateRoomStatusDto = z.infer<typeof updateRoomStatusSchema>;
