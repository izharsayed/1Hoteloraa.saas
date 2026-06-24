"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _database = require('../../config/database'); var _database2 = _interopRequireDefault(_database);

var _errormiddleware = require('../../middleware/error.middleware');

 const getRoles = async (tenantId) => {
  return _database2.default.role.findMany({
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
}; exports.getRoles = getRoles;

 const getRoleById = async (tenantId, id) => {
  const role = await _database2.default.role.findFirst({
    where: { id, tenantId },
    include: {
      permissions: {
        include: {
          permission: true,
        },
      },
    },
  });

  if (!role) throw _errormiddleware.createError.call(void 0, 'Role not found', 404);
  return role;
}; exports.getRoleById = getRoleById;

 const createRole = async (tenantId, dto) => {
  const existing = await _database2.default.role.findFirst({
    where: { tenantId, name: dto.name },
  });
  if (existing) throw _errormiddleware.createError.call(void 0, `Role "${dto.name}" already exists`, 409);

  return _database2.default.$transaction(async (tx) => {
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
}; exports.createRole = createRole;

 const updateRole = async (tenantId, id, dto) => {
  const role = await exports.getRoleById.call(void 0, tenantId, id);

  if (role.isSystem) {
    throw _errormiddleware.createError.call(void 0, 'System roles cannot be modified', 400);
  }

  if (dto.name && dto.name !== role.name) {
    const duplicate = await _database2.default.role.findFirst({
      where: { tenantId, name: dto.name, id: { not: id } },
    });
    if (duplicate) throw _errormiddleware.createError.call(void 0, `Role "${dto.name}" already exists`, 409);
  }

  return _database2.default.$transaction(async (tx) => {
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
}; exports.updateRole = updateRole;

 const deleteRole = async (tenantId, id) => {
  const role = await exports.getRoleById.call(void 0, tenantId, id);

  if (role.isSystem) {
    throw _errormiddleware.createError.call(void 0, 'System roles cannot be deleted', 400);
  }

  const assignedUsersCount = await _database2.default.user.count({
    where: { roleId: id },
  });

  if (assignedUsersCount > 0) {
    throw _errormiddleware.createError.call(void 0, `Cannot delete role: ${assignedUsersCount} users are currently assigned to it`, 400);
  }

  await _database2.default.role.delete({
    where: { id },
  });

  return { message: 'Role deleted successfully' };
}; exports.deleteRole = deleteRole;
