import { z } from 'zod';

export const createRoleSchema = z.object({
  name: z.string().min(1, 'Role name is required'),
  description: z.string().optional(),
  permissionIds: z
    .array(z.string().uuid('Each permissionId must be a valid UUID'))
    .default([]),
});

export const updateRoleSchema = z.object({
  name: z.string().min(1, 'Role name is required').optional(),
  description: z.string().optional(),
  permissionIds: z
    .array(z.string().uuid('Each permissionId must be a valid UUID'))
    .optional(),
});

export type CreateRoleDto = z.infer<typeof createRoleSchema>;
export type UpdateRoleDto = z.infer<typeof updateRoleSchema>;
