import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import * as checkOutService from './checkout.service';
import { sendSuccess } from '../../shared/helpers';

export const getPendingCheckOuts = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.user!.tenantId;
    const result = await checkOutService.getPendingCheckOuts(tenantId);
    sendSuccess(res, result, 'Pending check-outs retrieved successfully');
  } catch (err) {
    next(err);
  }
};

export const getTodayCheckOuts = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.user!.tenantId;
    const result = await checkOutService.getTodayCheckOuts(tenantId);
    sendSuccess(res, result, 'Today\'s check-outs retrieved successfully');
  } catch (err) {
    next(err);
  }
};

export const checkOut = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.user!.tenantId;
    const userId = req.user!.id;
    const result = await checkOutService.checkOut(tenantId, userId, req.body);
    sendSuccess(res, result, 'Check-out completed successfully');
  } catch (err) {
    next(err);
  }
};
