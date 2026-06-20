import { z } from 'zod';

// ---------------------------------------------------------------------------
// Create KOT
// ---------------------------------------------------------------------------
export const createKOTSchema = z.object({
  orderId: z.string().uuid('Invalid order ID'),
  itemIds: z
    .array(z.string().uuid('Invalid order item ID'))
    .min(1, 'At least one order item ID is required'),
  notes: z.string().optional(),
});

export type CreateKOTDto = z.infer<typeof createKOTSchema>;

// ---------------------------------------------------------------------------
// Update KOT Status
// ---------------------------------------------------------------------------
export const updateKOTStatusSchema = z.object({
  status: z.enum(['PENDING', 'IN_PROGRESS', 'READY', 'CANCELLED'], {
    required_error: 'Status is required',
    invalid_type_error: 'Invalid KOT status',
  }),
});

export type UpdateKOTStatusDto = z.infer<typeof updateKOTStatusSchema>;
