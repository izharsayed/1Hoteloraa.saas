import { Router } from 'express';
import { authenticate, checkPermission } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { createVendorSchema, updateVendorSchema } from './vendors.dto';
import * as vendorController from './vendors.controller';

const router = Router();

router.use(authenticate);

router.get('/',    checkPermission('VENDORS', 'READ'),   vendorController.listVendors);
router.get('/:id', checkPermission('VENDORS', 'READ'),   vendorController.getVendor);
router.post('/',   checkPermission('VENDORS', 'CREATE'), validate(createVendorSchema), vendorController.createVendor);
router.put('/:id', checkPermission('VENDORS', 'UPDATE'), validate(updateVendorSchema), vendorController.updateVendor);
router.delete('/:id', checkPermission('VENDORS', 'DELETE'), vendorController.deleteVendor);

export default router;
