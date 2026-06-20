import { z } from 'zod';

export const createGuestSchema = z.object({
  name: z.string().min(2).max(100),
  phone: z.string().min(7).max(20),
  email: z.string().email().optional(),
  idType: z.enum(['PASSPORT', 'DRIVING_LICENSE', 'NATIONAL_ID', 'AADHAAR', 'OTHER']),
  idNumber: z.string().max(50).optional(),
  address: z.string().max(500),
  city: z.string().max(100),
  country: z.string().max(100),
  nationality: z.string().max(100).optional(),
  dateOfBirth: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
  notes: z.string().max(1000).optional(),
});

export const updateGuestSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  phone: z.string().min(7).max(20).optional(),
  email: z.string().email().optional(),
  idType: z.enum(['PASSPORT', 'DRIVING_LICENSE', 'NATIONAL_ID', 'AADHAAR', 'OTHER']).optional(),
  idNumber: z.string().max(50).optional(),
  address: z.string().max(500).optional(),
  city: z.string().max(100).optional(),
  country: z.string().max(100).optional(),
  nationality: z.string().max(100).optional(),
  dateOfBirth: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
  notes: z.string().max(1000).optional(),
});

export type CreateGuestDto = z.infer<typeof createGuestSchema>;
export type UpdateGuestDto = z.infer<typeof updateGuestSchema>;
