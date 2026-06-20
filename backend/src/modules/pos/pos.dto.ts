import { z } from 'zod';

export const quickOrderSchema = z.object({
  tableId: z.string().uuid().optional().nullable(),
  items: z.array(
    z.object({
      menuItemId: z.string().uuid('menuItemId must be a valid UUID'),
      quantity: z.number().int().positive('Quantity must be at least 1'),
      notes: z.string().max(500).optional().nullable(),
    })
  ).min(1, 'Order must contain at least 1 item'),
});

export type QuickOrderDto = z.infer<typeof quickOrderSchema>;
