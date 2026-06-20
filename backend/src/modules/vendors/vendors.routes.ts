import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { createVendorSchema, updateVendorSchema } from './vendors.dto';
import * as vendorController from './vendors.controller';

const router = Router();

router.use(authenticate);

router.get('/', vendorController.listVendors);
router.get('/:id', vendorController.getVendor);
router.post('/', validate(createVendorSchema), vendorController.createVendor);
router.put('/:id', validate(updateVendorSchema), vendorController.updateVendor);
router.delete('/:id', vendorController.deleteVendor);

export default router;
