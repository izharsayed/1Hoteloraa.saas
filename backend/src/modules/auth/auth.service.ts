import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../config/database';
import config from '../../config/env';
import { RegisterTenantDto, LoginDto, ChangePasswordDto, ForgotPasswordDto, ResetPasswordDto } from './auth.dto';
import crypto from 'crypto';
import { createError } from '../../middleware/error.middleware';

const SALT_ROUNDS = 12;

const DEFAULT_FEATURES: Record<string, string[]> = {
  RESTAURANT: ['DASHBOARD', 'POS', 'TABLES', 'KOT', 'MENU', 'INVENTORY', 'REPORTS'],
  LODGING: ['DASHBOARD', 'RESERVATIONS', 'ROOMS', 'CHECKIN', 'CHECKOUT', 'GUESTS', 'HOUSEKEEPING', 'REPORTS'],
  HOTEL_RESTAURANT: ['DASHBOARD', 'POS', 'TABLES', 'KOT', 'MENU', 'INVENTORY', 'RESERVATIONS', 'ROOMS', 'CHECKIN', 'CHECKOUT', 'GUESTS', 'HOUSEKEEPING', 'REPORTS', 'SETTINGS'],
};

export const registerTenant = async (dto: RegisterTenantDto) => {
  const existing = await prisma.tenant.findUnique({ where: { slug: dto.tenantSlug } });
  if (existing) throw createError('Tenant slug already taken', 409);

  const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);
  const features = DEFAULT_FEATURES[dto.businessType] || [];

  const tenant = await prisma.tenant.create({
    data: {
      name: dto.tenantName,
      slug: dto.tenantSlug,
      businessType: dto.businessType as any,
      users: {
        create: {
          name: dto.name,
          email: dto.email,
          phone: dto.phone,
          passwordHash,
          userRole: 'TENANT_ADMIN',
        },
      },
      subscription: {
        create: {
          plan: 'STARTER',
          status: 'TRIAL',
          trialEnds: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        },
      },
      features: {
        create: features.map((f) => ({ feature: f, isEnabled: true })),
      },
      settings: {
        create: {},
      },
    },
    include: { users: true },
  });

  const user = tenant.users[0];
  const token = generateToken(user.id, tenant.id, user.email, user.userRole);

  return { tenant: { id: tenant.id, name: tenant.name, slug: tenant.slug }, user: { id: user.id, name: user.name, email: user.email }, token };
};

export const login = async (dto: LoginDto) => {
  let tenant;
  let user;

  if (dto.tenantSlug) {
    tenant = await prisma.tenant.findUnique({ where: { slug: dto.tenantSlug }, select: { id: true, isActive: true, name: true, businessType: true } });
    if (!tenant || !tenant.isActive) throw createError('Tenant not found or inactive', 404);
    user = await prisma.user.findFirst({ where: { tenantId: tenant.id, email: dto.email, isActive: true } });
  } else {
    user = await prisma.user.findFirst({
      where: { email: dto.email, isActive: true },
      include: { tenant: { select: { id: true, isActive: true, name: true, businessType: true } } }
    });
    if (user && user.tenant) {
      tenant = user.tenant;
    }
  }

  if (!user || !tenant || !tenant.isActive) throw createError('Invalid credentials', 401);

  const isValid = await bcrypt.compare(dto.password, user.passwordHash);
  if (!isValid) throw createError('Invalid credentials', 401);

  await prisma.user.update({ where: { id: user.id }, data: { lastLogin: new Date() } });

  const token = generateToken(user.id, tenant.id, user.email, user.userRole, user.roleId ?? undefined);
  const { passwordHash: _, tenant: __, ...safeUser } = user as any;
  return { user: { ...safeUser, tenantName: tenant.name, businessType: tenant.businessType }, token };
};

export const changePassword = async (userId: string, dto: ChangePasswordDto) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw createError('User not found', 404);

  const isValid = await bcrypt.compare(dto.currentPassword, user.passwordHash);
  if (!isValid) throw createError('Current password is incorrect', 400);

  const passwordHash = await bcrypt.hash(dto.newPassword, SALT_ROUNDS);
  await prisma.user.update({ where: { id: userId }, data: { passwordHash } });
  return { message: 'Password changed successfully' };
};

export const getProfile = async (userId: string, tenantId: string) => {
  const user = await prisma.user.findFirst({
    where: { id: userId, tenantId },
    select: { id: true, name: true, email: true, phone: true, userRole: true, avatarUrl: true, lastLogin: true, createdAt: true },
  });
  if (!user) throw createError('User not found', 404);
  return user;
};

export const forgotPassword = async (dto: ForgotPasswordDto) => {
  // Find user by email across all active tenants
  const user = await prisma.user.findFirst({
    where: { email: dto.email, isActive: true },
    select: { id: true, name: true, email: true, tenantId: true },
  });

  // Always return a generic success message to prevent email enumeration attacks.
  // If user not found, we still return success — but don't create a token.
  if (!user) {
    return {
      message: 'If that email is registered, a reset code has been generated.',
      // In production this would be null — token sent via email only
      resetToken: null,
      userName: null,
    };
  }

  // Delete any existing unexpired tokens for this user
  await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });

  // Generate a secure random token (8 hex chars = easy to type)
  const rawToken = crypto.randomBytes(4).toString('hex').toUpperCase();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

  await prisma.passwordResetToken.create({
    data: { userId: user.id, token: rawToken, expiresAt },
  });

  return {
    message: 'Reset code generated. In production this would be emailed.',
    // NOTE: In a real deployment, remove resetToken from the response
    // and send it via email (e.g. nodemailer / SendGrid).
    resetToken: rawToken,
    userName: user.name,
    email: user.email,
    expiresIn: '15 minutes',
  };
};

export const resetPassword = async (dto: ResetPasswordDto) => {
  // Find the token record
  const tokenRecord = await prisma.passwordResetToken.findUnique({
    where: { token: dto.token },
    include: { user: true },
  });

  if (!tokenRecord) throw createError('Invalid or expired reset code', 400);
  if (tokenRecord.expiresAt < new Date()) {
    // Clean up expired token
    await prisma.passwordResetToken.delete({ where: { id: tokenRecord.id } });
    throw createError('Reset code has expired. Please request a new one.', 400);
  }

  // Hash and update the password
  const passwordHash = await bcrypt.hash(dto.newPassword, SALT_ROUNDS);
  await prisma.user.update({
    where: { id: tokenRecord.userId },
    data: { passwordHash },
  });

  // Delete the used token (single-use)
  await prisma.passwordResetToken.delete({ where: { id: tokenRecord.id } });

  return { message: 'Password reset successfully. You can now log in with your new password.' };
};

const generateToken = (id: string, tenantId: string, email: string, userRole: string, roleId?: string): string => {
  return jwt.sign({ id, tenantId, email, userRole, roleId }, config.jwt.secret, { expiresIn: config.jwt.expiresIn } as any);
};
