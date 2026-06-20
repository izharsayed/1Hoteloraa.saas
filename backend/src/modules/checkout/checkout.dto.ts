import { z } from 'zod';

export const checkOutSchema = z.object({
  reservationId: z.string().uuid({ message: 'reservationId must be a valid UUID' }),
  extraCharges: z.number().nonnegative().default(0).optional(),
  discount: z.number().nonnegative().default(0).optional(),
  paymentMethod: z.enum(['CASH', 'CARD', 'UPI', 'BANK_TRANSFER', 'WALLET', 'CREDIT'], {
    errorMap: () => ({
      message: 'paymentMethod must be one of CASH, CARD, UPI, BANK_TRANSFER, WALLET, CREDIT',
    }),
  }),
  notes: z.string().max(1000).optional(),
});

export type CheckOutDto = z.infer<typeof checkOutSchema>;
