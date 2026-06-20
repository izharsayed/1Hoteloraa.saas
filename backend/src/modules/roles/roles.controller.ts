import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import * as rolesService from './roles.service';
import { sendSuccess } from '../../shared/helpers';

export const getRoles = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.user!.tenantId;
    const result = await rolesService.getRoles(tenantId);
    sendSuccess(res, result, 'Roles retrieved successfully');
  } catch (err) {
    next(err);
  }
};

export const getRoleById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.user!.tenantId;
    const { id } = req.params;
    const result = await rolesService.getRoleById(tenantId, id);
    sendSuccess(res, result, 'Role retrieved successfully');
  } catch (err) {
    next(err);
  }
};

export const createRole = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.user!.tenantId;
    const result = await rolesService.createRole(tenantId, req.body);
    sendSuccess(res, result, 'Role created successfully', 201);
  } catch (err) {
    next(err);
  }
};

export const updateRole = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.user!.tenantId;
    const { id } = req.params;
    const result = await rolesService.updateRole(tenantId, id, req.body);
    sendSuccess(res, result, 'Role updated successfully');
  } catch (err) {
    next(err);
  }
};

export const deleteRole = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.user!.tenantId;
    const { id } = req.params;
    const result = await rolesService.deleteRole(tenantId, id);
    sendSuccess(res, result, 'Role deleted successfully');
  } catch (err) {
    next(err);
  }
};
