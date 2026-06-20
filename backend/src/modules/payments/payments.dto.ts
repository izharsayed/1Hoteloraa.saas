import { z } from 'zod';

export const createPaymentSchema = z.object({
  orderId: z.string().uuid().optional().nullable(),
  reservationId: z.string().uuid().optional().nullable(),
  amount: z.number().positive('Amount must be positive'),
  method: z.enum(['CASH', 'CARD', 'UPI', 'BANK_TRANSFER', 'WALLET', 'CREDIT']),
  reference: z.string().max(200).optional().nullable(),
  notes: z.string().max(1000).optional().nullable(),
}).refine(data => data.orderId || data.reservationId, {
  message: 'Either orderId or reservationId must be provided',
  path: ['orderId'],
});

export type CreatePaymentDto = z.infer<typeof createPaymentSchema>;
