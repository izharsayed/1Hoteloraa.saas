import prisma from '../../config/database';
import { CreateRoleDto, UpdateRoleDto } from './roles.dto';
import { createError } from '../../middleware/error.middleware';

export const getRoles = async (tenantId: string) => {
  return prisma.role.findMany({
    where: { tenantId },
    include: {
      permissions: {
        include: {
          permission: true,
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  });
};

export const getRoleById = async (tenantId: string, id: string) => {
  const role = await prisma.role.findFirst({
    where: { id, tenantId },
    include: {
      permissions: {
        include: {
          permission: true,
        },
      },
    },
  });

  if (!role) throw createError('Role not found', 404);
  return role;
};

export const createRole = async (tenantId: string, dto: CreateRoleDto) => {
  const existing = await prisma.role.findFirst({
    where: { tenantId, name: dto.name },
  });
  if (existing) throw createError(`Role "${dto.name}" already exists`, 409);

  return prisma.$transaction(async (tx) => {
    const role = await tx.role.create({
      data: {
        tenantId,
        name: dto.name,
        description: dto.description,
      },
    });

    if (dto.permissionIds && dto.permissionIds.length > 0) {
      await tx.rolePermission.createMany({
        data: dto.permissionIds.map((pid) => ({
          roleId: role.id,
          permissionId: pid,
        })),
      });
    }

    return tx.role.findUnique({
      where: { id: role.id },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });
  });
};

export const updateRole = async (tenantId: string, id: string, dto: UpdateRoleDto) => {
  const role = await getRoleById(tenantId, id);

  if (role.isSystem) {
    throw createError('System roles cannot be modified', 400);
  }

  if (dto.name && dto.name !== role.name) {
    const duplicate = await prisma.role.findFirst({
      where: { tenantId, name: dto.name, id: { not: id } },
    });
    if (duplicate) throw createError(`Role "${dto.name}" already exists`, 409);
  }

  return prisma.$transaction(async (tx) => {
    await tx.role.update({
      where: { id },
      data: {
        name: dto.name,
        description: dto.description,
      },
    });

    if (dto.permissionIds !== undefined) {
      // Clear existing
      await tx.rolePermission.deleteMany({
        where: { roleId: id },
      });

      // Create new ones
      if (dto.permissionIds.length > 0) {
        await tx.rolePermission.createMany({
          data: dto.permissionIds.map((pid) => ({
            roleId: id,
            permissionId: pid,
          })),
        });
      }
    }

    return tx.role.findUnique({
      where: { id },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });
  });
};

export const deleteRole = async (tenantId: string, id: string) => {
  const role = await getRoleById(tenantId, id);

  if (role.isSystem) {
    throw createError('System roles cannot be deleted', 400);
  }

  const assignedUsersCount = await prisma.user.count({
    where: { roleId: id },
  });

  if (assignedUsersCount > 0) {
    throw createError(`Cannot delete role: ${assignedUsersCount} users are currently assigned to it`, 400);
  }

  await prisma.role.delete({
    where: { id },
  });

  return { message: 'Role deleted successfully' };
};
