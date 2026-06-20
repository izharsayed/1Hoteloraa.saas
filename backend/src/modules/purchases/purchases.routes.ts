import { Router } from 'express';
import { authenticate, checkPermission } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import {
  createPurchaseSchema,
  updatePurchaseStatusSchema,
} from './purchases.dto';
import * as purchaseController from './purchases.controller';

const router = Router();

router.use(authenticate);

router.get('/',    checkPermission('PURCHASES', 'READ'),   purchaseController.listPurchases);
router.get('/:id', checkPermission('PURCHASES', 'READ'),   purchaseController.getPurchase);
router.post('/',   checkPermission('PURCHASES', 'CREATE'), validate(createPurchaseSchema), purchaseController.createPurchase);
router.post('/:id/receive', checkPermission('PURCHASES', 'UPDATE'), purchaseController.receivePurchase);
router.patch('/:id/status', checkPermission('PURCHASES', 'UPDATE'), validate(updatePurchaseStatusSchema), purchaseController.updatePurchaseStatus);

export default router;
