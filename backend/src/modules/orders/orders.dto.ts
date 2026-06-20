import { z } from 'zod';

// ---------------------------------------------------------------------------
// Create Order
// ---------------------------------------------------------------------------
export const createOrderSchema = z.object({
  tableId: z.string().uuid('Invalid table ID').optional(),
  items: z
    .array(
      z.object({
        menuItemId: z.string().uuid('Invalid menu item ID'),
        quantity: z.number().int().positive('Quantity must be a positive integer'),
        notes: z.string().optional(),
      })
    )
    .min(1, 'At least one item is required'),
  notes: z.string().optional(),
});

export type CreateOrderDto = z.infer<typeof createOrderSchema>;

// ---------------------------------------------------------------------------
// Update Order Status
// ---------------------------------------------------------------------------
export const updateOrderStatusSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'SERVED', 'CANCELLED', 'COMPLETED'], {
    required_error: 'Status is required',
    invalid_type_error: 'Invalid order status',
  }),
});

export type UpdateOrderStatusDto = z.infer<typeof updateOrderStatusSchema>;

// ---------------------------------------------------------------------------
// Add Items to Order
// ---------------------------------------------------------------------------
export const addItemsSchema = z.object({
  items: z
    .array(
      z.object({
        menuItemId: z.string().uuid('Invalid menu item ID'),
        quantity: z.number().int().positive('Quantity must be a positive integer'),
        notes: z.string().optional(),
      })
    )
    .min(1, 'At least one item is required'),
});

export type AddItemsDto = z.infer<typeof addItemsSchema>;
