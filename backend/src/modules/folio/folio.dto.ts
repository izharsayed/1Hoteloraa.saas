import { z } from 'zod';

export const addFolioItemSchema = z.object({
  paymentId: z.string().uuid('paymentId must be a valid UUID'),
  description: z.string().min(1, 'description is required').max(500),
  amount: z.number().positive('amount must be positive'),
  type: z.enum(['CHARGE', 'PAYMENT', 'DISCOUNT']),
});

export type AddFolioItemDto = z.infer<typeof addFolioItemSchema>;
