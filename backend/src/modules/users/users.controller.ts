import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import * as usersService from './users.service';
import { sendSuccess } from '../../shared/helpers';

export const getUsers = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.user!.tenantId;
    const result = await usersService.getUsers(tenantId);
    sendSuccess(res, result, 'Users retrieved successfully');
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.user!.tenantId;
    const { id } = req.params;
    const result = await usersService.getUserById(tenantId, id);
    sendSuccess(res, result, 'User retrieved successfully');
  } catch (err) {
    next(err);
  }
};

export const createUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.user!.tenantId;
    const result = await usersService.createUser(tenantId, req.body);
    sendSuccess(res, result, 'User created successfully', 201);
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.user!.tenantId;
    const { id } = req.params;
    const result = await usersService.updateUser(tenantId, id, req.body);
    sendSuccess(res, result, 'User updated successfully');
  } catch (err) {
    next(err);
  }
};

export const toggleUserStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.user!.tenantId;
    const { id } = req.params;
    const result = await usersService.toggleUserStatus(tenantId, id);
    sendSuccess(res, result, 'User status toggled successfully');
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.user!.tenantId;
    const { id } = req.params;
    const { newPassword } = req.body;
    const result = await usersService.resetPassword(tenantId, id, newPassword);
    sendSuccess(res, result, 'Password reset successfully');
  } catch (err) {
    next(err);
  }
};
