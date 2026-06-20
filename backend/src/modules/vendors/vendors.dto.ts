import { z } from 'zod';

export const createVendorSchema = z.object({
  name: z.string().min(1, 'Vendor name is required').max(150),
  email: z.string().email('Invalid email').optional(),
  phone: z.string().max(20).optional(),
  address: z.string().max(500).optional(),
  gstin: z
    .string()
    .max(15)
    .regex(/^[A-Z0-9]+$/, 'Invalid GSTIN format')
    .optional(),
  contactName: z.string().max(100).optional(),
});

export const updateVendorSchema = createVendorSchema.partial();

export type CreateVendorDto = z.infer<typeof createVendorSchema>;
export type UpdateVendorDto = z.infer<typeof updateVendorSchema>;
