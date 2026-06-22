import { z } from 'zod';

export const createNotificationSchema = z.object({
  userId: z.string().uuid().optional().nullable(),
  role: z.string().optional().nullable(),
  title: z.string().min(1).max(100),
  message: z.string().min(1).max(500),
  type: z.enum(['INFO', 'SUCCESS', 'WARNING', 'DANGER']).default('INFO'),
});

export type CreateNotificationDto = z.infer<typeof createNotificationSchema>;
