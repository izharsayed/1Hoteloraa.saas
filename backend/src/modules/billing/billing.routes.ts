import { Router } from 'express';
import * as billingController from './billing.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { generateBillSchema } from './billing.dto';

const router = Router();

router.use(authenticate);

router.get('/order/:orderId', billingController.getBillByOrderId);
router.post('/generate', validate(generateBillSchema), billingController.generateBill);
router.get('/recent', billingController.getRecentBills);
router.get('/daily-sales', billingController.getDailySales);

export default router;
