import { z } from 'zod';

export const reportQuerySchema = z.object({
  type: z.enum(['DAILY_SALES', 'OCCUPANCY', 'INVENTORY', 'REVENUE']),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'startDate must be in format YYYY-MM-DD').optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'endDate must be in format YYYY-MM-DD').optional(),
});

export type ReportQueryDto = z.infer<typeof reportQuerySchema>;
