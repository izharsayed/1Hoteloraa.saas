"use strict";Object.defineProperty(exports, "__esModule", {value: true});var _zod = require('zod');

 const registerTenantSchema = _zod.z.object({
  tenantName: _zod.z.string().min(2).max(100),
  tenantSlug: _zod.z.string().min(2).max(50).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, hyphens'),
  businessType: _zod.z.enum(['RESTAURANT', 'LODGING', 'HOTEL_RESTAURANT']),
  name: _zod.z.string().min(2).max(100),
  email: _zod.z.string().email(),
  password: _zod.z.string().min(6),
  phone: _zod.z.string().optional(),
}); exports.registerTenantSchema = registerTenantSchema;

 const loginSchema = _zod.z.object({
  email: _zod.z.string().email(),
  password: _zod.z.string().min(1),
  tenantSlug: _zod.z.string().min(1).optional(),
}); exports.loginSchema = loginSchema;

 const changePasswordSchema = _zod.z.object({
  currentPassword: _zod.z.string().min(1),
  newPassword: _zod.z.string().min(6),
}); exports.changePasswordSchema = changePasswordSchema;

 const forgotPasswordSchema = _zod.z.object({
  email: _zod.z.string().email(),
}); exports.forgotPasswordSchema = forgotPasswordSchema;

 const resetPasswordSchema = _zod.z.object({
  token: _zod.z.string().min(1),
  newPassword: _zod.z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: _zod.z.string().min(6),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
}); exports.resetPasswordSchema = resetPasswordSchema;







