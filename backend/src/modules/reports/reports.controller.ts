import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import * as reportsService from './reports.service';
import { sendSuccess } from '../../shared/helpers';

export const generateReport = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.user!.tenantId;
    const result = await reportsService.generateReport(tenantId, req.query as any);
    sendSuccess(res, result, 'Report generated and saved successfully');
  } catch (err) {
    next(err);
  }
};

export const getSavedReports = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.user!.tenantId;
    const result = await reportsService.getSavedReports(tenantId);
    sendSuccess(res, result, 'Saved reports retrieved successfully');
  } catch (err) {
    next(err);
  }
};
