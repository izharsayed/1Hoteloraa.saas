import { z } from 'zod';

export const checkInSchema = z.object({
  reservationId: z.string().uuid({ message: 'reservationId must be a valid UUID' }),
  notes: z.string().max(1000).optional(),
});

export type CheckInDto = z.infer<typeof checkInSchema>;
