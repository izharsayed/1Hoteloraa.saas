import { Router } from 'express';
import * as dashboardController from './dashboard.controller';
import { authenticate, checkPermission } from '../../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', checkPermission('DASHBOARD', 'READ'), dashboardController.getDashboard);

export default router;
