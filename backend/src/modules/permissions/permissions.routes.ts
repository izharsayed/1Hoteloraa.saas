import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import prisma from '../../config/database';
import { sendSuccess } from '../../shared/helpers';
import { NextFunction, Response } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';

const router = Router();

// GET all permissions (system-wide)
router.get('/', authenticate, authorize('SUPER_ADMIN', 'TENANT_ADMIN'), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const permissions = await prisma.permission.findMany({ orderBy: [{ module: 'asc' }, { action: 'asc' }] });
    sendSuccess(res, permissions);
  } catch (err) { next(err); }
});

// POST seed permissions (super admin only)
router.post('/seed', authenticate, authorize('SUPER_ADMIN'), async (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const modules = ['DASHBOARD', 'TABLES', 'MENU', 'ORDERS', 'KOT', 'BILLING', 'POS', 'ROOMS', 'ROOM_TYPES', 'GUESTS', 'RESERVATIONS', 'CHECKIN', 'CHECKOUT', 'HOUSEKEEPING', 'INVENTORY', 'VENDORS', 'PURCHASES', 'PAYMENTS', 'REPORTS', 'SETTINGS', 'USERS', 'ROLES'];
    const actions = ['CREATE', 'READ', 'UPDATE', 'DELETE'];
    const data = modules.flatMap(module => actions.map(action => ({ module, action })));
    
    await prisma.permission.createMany({ data, skipDuplicates: true });
    sendSuccess(res, { seeded: data.length }, 'Permissions seeded');
  } catch (err) { next(err); }
});

export default router;
