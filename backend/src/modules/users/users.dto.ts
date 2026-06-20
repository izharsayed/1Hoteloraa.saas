import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
  userRole: z.enum([
    'SUPER_ADMIN',
    'TENANT_ADMIN',
    'MANAGER',
    'RECEPTIONIST',
    'WAITER',
    'CHEF',
    'HOUSEKEEPING',
    'ACCOUNTANT',
    'CASHIER',
  ]),
  roleId: z.string().uuid('Invalid role ID').optional(),
});

export const updateUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  phone: z.string().optional(),
  userRole: z
    .enum([
      'SUPER_ADMIN',
      'TENANT_ADMIN',
      'MANAGER',
      'RECEPTIONIST',
      'WAITER',
      'CHEF',
      'HOUSEKEEPING',
      'ACCOUNTANT',
      'CASHIER',
    ])
    .optional(),
  roleId: z.string().uuid('Invalid role ID').nullable().optional(),
});

export const resetPasswordSchema = z.object({
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
export type UpdateUserDto = z.infer<typeof updateUserSchema>;
export type ResetPasswordDto = z.infer<typeof resetPasswordSchema>;
