import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import * as dashboardService from './dashboard.service';
import prisma from '../../config/database';
import { sendSuccess } from '../../shared/helpers';
import { createError } from '../../middleware/error.middleware';

export const getDashboard = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.user!.tenantId;

    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { businessType: true },
    });

    if (!tenant) {
      throw createError('Tenant not found', 404);
    }

    const result = await dashboardService.getDashboard(tenantId, tenant.businessType);
    sendSuccess(res, result, 'Dashboard metrics retrieved successfully');
  } catch (err) {
    next(err);
  }
};
