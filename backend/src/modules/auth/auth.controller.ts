import { Request, Response, NextFunction } from 'express';
import * as authService from './auth.service';
import { AuthRequest } from '../../middleware/auth.middleware';
import { sendSuccess, sendError } from '../../shared/helpers';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.registerTenant(req.body);
    sendSuccess(res, result, 'Tenant registered successfully', 201);
  } catch (err) { next(err); }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.login(req.body);
    sendSuccess(res, result, 'Login successful');
  } catch (err) { next(err); }
};

export const changePassword = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await authService.changePassword(req.user!.id, req.body);
    sendSuccess(res, result, 'Password changed');
  } catch (err) { next(err); }
};

export const getProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await authService.getProfile(req.user!.id, req.user!.tenantId);
    sendSuccess(res, result);
  } catch (err) { next(err); }
};

export const logout = (_req: Request, res: Response) => {
  sendSuccess(res, null, 'Logged out successfully');
};
