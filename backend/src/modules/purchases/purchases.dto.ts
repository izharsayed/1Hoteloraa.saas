import { z } from 'zod';

export const createPurchaseSchema = z.object({
  vendorId: z.string().uuid('Invalid vendor ID').optional(),
  items: z
    .array(
      z.object({
        inventoryItemId: z.string().uuid('Invalid inventory item ID'),
        quantity: z.number().positive('Quantity must be positive'),
        unitPrice: z.number().min(0, 'Unit price cannot be negative'),
      })
    )
    .min(1, 'At least one purchase item is required'),
  notes: z.string().max(1000).optional(),
});

export const updatePurchaseStatusSchema = z.object({
  status: z.enum(['PENDING', 'RECEIVED', 'PARTIAL', 'CANCELLED'], {
    required_error: 'Status is required',
    invalid_type_error: 'Invalid purchase status',
  }),
});

export type CreatePurchaseDto = z.infer<typeof createPurchaseSchema>;
export type UpdatePurchaseStatusDto = z.infer<typeof updatePurchaseStatusSchema>;
