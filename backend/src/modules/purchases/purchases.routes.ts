import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import {
  createPurchaseSchema,
  updatePurchaseStatusSchema,
} from './purchases.dto';
import * as purchaseController from './purchases.controller';

const router = Router();

router.use(authenticate);

router.get('/', purchaseController.listPurchases);
router.get('/:id', purchaseController.getPurchase);
router.post('/', validate(createPurchaseSchema), purchaseController.createPurchase);
router.post('/:id/receive', purchaseController.receivePurchase);
router.patch(
  '/:id/status',
  validate(updatePurchaseStatusSchema),
  purchaseController.updatePurchaseStatus
);

export default router;
