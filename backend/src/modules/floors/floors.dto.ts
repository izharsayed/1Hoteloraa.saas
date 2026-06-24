import { z } from 'zod';

export const createFloorSchema = z.object({
  name: z.string().min(1).max(50),
});

export type CreateFloorDto = z.infer<typeof createFloorSchema>;
