import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import prisma from '../../config/database';
import { sendSuccess } from '../../shared/helpers';
import { AuthRequest } from '../../middleware/auth.middleware';
import { NextFunction, Response } from 'express';

const router = Router();

// GET current subscription
router.get('/', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const subscription = await prisma.subscription.findUnique({ where: { tenantId: req.user!.tenantId } });
    sendSuccess(res, subscription);
  } catch (err) { next(err); }
});

// PUT upgrade plan (SUPER_ADMIN only in full impl)
router.put('/upgrade', authenticate, authorize('SUPER_ADMIN', 'TENANT_ADMIN'), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { plan, endDate } = req.body;
    const subscription = await prisma.subscription.update({
      where: { tenantId: req.user!.tenantId },
      data: { plan, status: 'ACTIVE', endDate: endDate ? new Date(endDate) : undefined },
    });
    sendSuccess(res, subscription, 'Subscription updated');
  } catch (err) { next(err); }
});

export default router;
