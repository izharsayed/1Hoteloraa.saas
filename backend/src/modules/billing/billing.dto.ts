import { z } from 'zod';

// ---------------------------------------------------------------------------
// Generate Bill
// ---------------------------------------------------------------------------
export const generateBillSchema = z.object({
  orderId: z.string().uuid('Invalid order ID'),
  discountAmount: z
    .number()
    .min(0, 'Discount cannot be negative')
    .optional()
    .default(0),
  paymentMethod: z.enum(
    ['CASH', 'CARD', 'UPI', 'BANK_TRANSFER', 'WALLET', 'CREDIT'],
    {
      required_error: 'Payment method is required',
      invalid_type_error: 'Invalid payment method',
    }
  ),
  reference: z.string().max(200).optional(),
  notes: z.string().max(1000).optional(),
});

export type GenerateBillDto = z.infer<typeof generateBillSchema>;
