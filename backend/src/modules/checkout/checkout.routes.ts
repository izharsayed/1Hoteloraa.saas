import { Router } from 'express';
import * as checkOutController from './checkout.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { checkOutSchema } from './checkout.dto';

const router = Router();

router.use(authenticate);

router.get('/pending', checkOutController.getPendingCheckOuts);
router.get('/today', checkOutController.getTodayCheckOuts);
router.post('/', validate(checkOutSchema), checkOutController.checkOut);

export default router;
