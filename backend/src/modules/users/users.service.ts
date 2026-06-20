import bcrypt from 'bcryptjs';
import prisma from '../../config/database';
import { CreateUserDto, UpdateUserDto } from './users.dto';
import { createError } from '../../middleware/error.middleware';

const SALT_ROUNDS = 12;

export const getUsers = async (tenantId: string) => {
  return prisma.user.findMany({
    where: { tenantId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      userRole: true,
      roleId: true,
      isActive: true,
      lastLogin: true,
      avatarUrl: true,
      createdAt: true,
      updatedAt: true,
      role: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  });
};

export const getUserById = async (tenantId: string, id: string) => {
  const user = await prisma.user.findFirst({
    where: { id, tenantId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      userRole: true,
      roleId: true,
      isActive: true,
      lastLogin: true,
      avatarUrl: true,
      createdAt: true,
      updatedAt: true,
      role: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!user) throw createError('User not found', 404);
  return user;
};

export const createUser = async (tenantId: string, dto: CreateUserDto) => {
  const existing = await prisma.user.findFirst({
    where: { tenantId, email: dto.email },
  });
  if (existing) throw createError('Email is already registered in this tenant', 400);

  const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      tenantId,
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      passwordHash,
      userRole: dto.userRole,
      roleId: dto.roleId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      userRole: true,
      roleId: true,
      isActive: true,
      createdAt: true,
    },
  });

  return user;
};

export const updateUser = async (tenantId: string, id: string, dto: UpdateUserDto) => {
  await getUserById(tenantId, id);

  return prisma.user.update({
    where: { id },
    data: dto as any,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      userRole: true,
      roleId: true,
      isActive: true,
      updatedAt: true,
    },
  });
};

export const toggleUserStatus = async (tenantId: string, id: string) => {
  const user = await getUserById(tenantId, id);

  return prisma.user.update({
    where: { id },
    data: {
      isActive: !user.isActive,
    },
    select: {
      id: true,
      name: true,
      isActive: true,
    },
  });
};

export const resetPassword = async (tenantId: string, id: string, newPassword: string) => {
  await getUserById(tenantId, id);

  const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);

  await prisma.user.update({
    where: { id },
    data: {
      passwordHash,
    },
  });

  return { message: 'Password reset successful' };
};
