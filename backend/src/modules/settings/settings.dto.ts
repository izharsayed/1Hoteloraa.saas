import { z } from 'zod';

export const updateSettingsSchema = z.object({
  taxRate: z.number().min(0).max(100).optional(),
  serviceCharge: z.number().min(0).max(100).optional(),
  invoicePrefix: z.string().min(1).max(10).optional(),
  kotPrefix: z.string().min(1).max(10).optional(),
  bookingPrefix: z.string().min(1).max(10).optional(),
  footerNote: z.string().max(1000).optional(),
  smtpHost: z.string().optional(),
  smtpPort: z.number().optional(),
  smtpUser: z.string().optional(),
  smtpPass: z.string().optional(),
  smsProvider: z.string().optional(),
  smsApiKey: z.string().optional(),
});

export type UpdateSettingsDto = z.infer<typeof updateSettingsSchema>;
