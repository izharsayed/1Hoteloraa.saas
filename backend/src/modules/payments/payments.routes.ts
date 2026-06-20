import { Router } from 'express';
import * as paymentsController from './payments.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { createPaymentSchema } from './payments.dto';

const router = Router();

router.use(authenticate);

router.get('/', paymentsController.getPayments);
router.get('/summary', paymentsController.getPaymentSummary);
router.get('/:id', paymentsController.getPaymentById);
router.post('/', validate(createPaymentSchema), paymentsController.createPayment);

export default router;
