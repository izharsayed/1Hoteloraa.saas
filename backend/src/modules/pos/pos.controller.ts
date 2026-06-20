import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import * as posService from './pos.service';
import { sendSuccess } from '../../shared/helpers';

export const getPOSData = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.user!.tenantId;
    const result = await posService.getPOSData(tenantId);
    sendSuccess(res, result, 'POS bootstrap data retrieved successfully');
  } catch (err) {
    next(err);
  }
};

export const quickOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.user!.tenantId;
    const userId = req.user!.id;
    const result = await posService.quickOrder(tenantId, userId, req.body);
    sendSuccess(res, result, 'Quick order created and KOT generated successfully', 201);
  } catch (err) {
    next(err);
  }
};
