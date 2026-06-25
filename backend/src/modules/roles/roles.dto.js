"use strict";Object.defineProperty(exports, "__esModule", {value: true});var _zod = require('zod');

 const createRoleSchema = _zod.z.object({
  name: _zod.z.string().min(1, 'Role name is required'),
  description: _zod.z.string().optional(),
  permissionIds: _zod.z
    .array(_zod.z.string().uuid('Each permissionId must be a valid UUID'))
    .default([]),
}); exports.createRoleSchema = createRoleSchema;

 const updateRoleSchema = _zod.z.object({
  name: _zod.z.string().min(1, 'Role name is required').optional(),
  description: _zod.z.string().optional(),
  permissionIds: _zod.z
    .array(_zod.z.string().uuid('Each permissionId must be a valid UUID'))
    .optional(),
}); exports.updateRoleSchema = updateRoleSchema;



