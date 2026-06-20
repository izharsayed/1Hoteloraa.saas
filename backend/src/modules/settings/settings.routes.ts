import { Router } from 'express';
import * as settingsController from './settings.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { updateSettingsSchema } from './settings.dto';

const router = Router();

router.use(authenticate);
router.use(authorize('SUPER_ADMIN', 'TENANT_ADMIN'));

router.get('/', settingsController.getSettings);
router.put('/', validate(updateSettingsSchema), settingsController.updateSettings);

export default router;
