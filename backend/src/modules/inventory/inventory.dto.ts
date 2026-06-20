import { z } from 'zod';

// Mirrors the Prisma InventoryUnit enum
const inventoryUnitValues = [
  'KG',
  'GRAM',
  'LITRE',
  'ML',
  'PIECE',
  'PACKET',
  'BOX',
  'DOZEN',
  'BOTTLE',
] as const;

export const createItemSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(200, 'Name must not exceed 200 characters'),
  description: z.string().max(1000).optional(),
  sku: z.string().max(100).optional(),
  unit: z.enum(inventoryUnitValues, {
    errorMap: () => ({
      message: `unit must be one of: ${inventoryUnitValues.join(', ')}`,
    }),
  }),
  quantity: z.number().min(0, 'Quantity must be 0 or greater').default(0),
  minimumStock: z.number().min(0, 'Minimum stock must be 0 or greater').default(0),
  costPrice: z.number().min(0, 'Cost price must be 0 or greater').default(0),
});

export const updateItemSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional().nullable(),
  sku: z.string().max(100).optional().nullable(),
  unit: z
    .enum(inventoryUnitValues, {
      errorMap: () => ({
        message: `unit must be one of: ${inventoryUnitValues.join(', ')}`,
      }),
    })
    .optional(),
  quantity: z.number().min(0).optional(),
  minimumStock: z.number().min(0).optional(),
  costPrice: z.number().min(0).optional(),
});

export const adjustStockSchema = z.object({
  quantity: z
    .number({ required_error: 'quantity is required' })
    .refine((v) => v !== 0, { message: 'quantity adjustment cannot be zero' }),
  reason: z
    .string()
    .min(1, 'reason is required')
    .max(500, 'reason must not exceed 500 characters'),
});

export type CreateItemDto = z.infer<typeof createItemSchema>;
export type UpdateItemDto = z.infer<typeof updateItemSchema>;
export type AdjustStockDto = z.infer<typeof adjustStockSchema>;
