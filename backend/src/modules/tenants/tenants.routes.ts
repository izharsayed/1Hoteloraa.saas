import { Router } from 'express';
import * as tenantsController from './tenants.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { updateTenantSchema } from './tenants.dto';

const router = Router();

router.use(authenticate);

router.get('/profile', tenantsController.getTenantProfile);
router.put('/profile', validate(updateTenantSchema), tenantsController.updateTenant);
router.get('/features', tenantsController.getTenantFeatures);
router.patch('/features/:feature/toggle', authorize('SUPER_ADMIN', 'TENANT_ADMIN'), tenantsController.toggleFeature);

export default router;
