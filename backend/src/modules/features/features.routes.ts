import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import prisma from '../../config/database';
import { sendSuccess } from '../../shared/helpers';
import { AuthRequest } from '../../middleware/auth.middleware';
import { NextFunction, Response } from 'express';

const router = Router();

// GET /features - list tenant features
router.get('/', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const features = await prisma.tenantFeature.findMany({ where: { tenantId: req.user!.tenantId } });
    sendSuccess(res, features);
  } catch (err) { next(err); }
});

// PATCH /features/:feature/toggle
router.patch('/:feature/toggle', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { feature } = req.params;
    const existing = await prisma.tenantFeature.findUnique({ where: { tenantId_feature: { tenantId: req.user!.tenantId, feature } } });
    
    if (!existing) {
      const created = await prisma.tenantFeature.create({ data: { tenantId: req.user!.tenantId, feature, isEnabled: true } });
      return sendSuccess(res, created, 'Feature enabled');
    }
    
    const updated = await prisma.tenantFeature.update({ where: { tenantId_feature: { tenantId: req.user!.tenantId, feature } }, data: { isEnabled: !existing.isEnabled } });
    sendSuccess(res, updated, `Feature ${updated.isEnabled ? 'enabled' : 'disabled'}`);
  } catch (err) { next(err); }
});

export default router;
