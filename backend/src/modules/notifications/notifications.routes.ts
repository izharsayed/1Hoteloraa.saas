import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import * as notificationsController from './notifications.controller';

const router = Router();

// All notifications routes require authentication
router.use(authenticate);

router.get('/', notificationsController.getNotifications);
router.patch('/:id/read', notificationsController.markAsRead);
router.post('/mark-all-read', notificationsController.markAllAsRead);

export default router;
