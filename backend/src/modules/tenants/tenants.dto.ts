import { z } from 'zod';

export const updateTenantSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  phone: z.string().optional(),
  email: z.string().email('Invalid email address').optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  logoUrl: z.string().url('Invalid logo URL').optional(),
  currency: z.string().length(3, 'Currency must be a 3-letter code').optional(),
  timezone: z.string().optional(),
});

export type UpdateTenantDto = z.infer<typeof updateTenantSchema>;
