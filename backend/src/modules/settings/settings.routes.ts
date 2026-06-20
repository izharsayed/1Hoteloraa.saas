import { Router } from 'express';
import * as settingsController from './settings.controller';
import { authenticate, checkPermission } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { updateSettingsSchema } from './settings.dto';

const router = Router();

router.use(authenticate);

// TENANT_ADMIN and MANAGER can read settings; only TENANT_ADMIN can update
router.get('/', checkPermission('SETTINGS', 'READ'),   settingsController.getSettings);
router.put('/', checkPermission('SETTINGS', 'UPDATE'), validate(updateSettingsSchema), settingsController.updateSettings);

export default router;
