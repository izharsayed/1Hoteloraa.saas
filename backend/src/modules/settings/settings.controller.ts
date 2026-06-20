import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import * as settingsService from './settings.service';
import { sendSuccess } from '../../shared/helpers';

export const getSettings = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.user!.tenantId;
    const result = await settingsService.getSettings(tenantId);
    sendSuccess(res, result, 'Settings retrieved successfully');
  } catch (err) {
    next(err);
  }
};

export const updateSettings = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.user!.tenantId;
    const result = await settingsService.updateSettings(tenantId, req.body);
    sendSuccess(res, result, 'Settings updated successfully');
  } catch (err) {
    next(err);
  }
};
