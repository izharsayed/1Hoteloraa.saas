import { Router } from 'express';
import * as posController from './pos.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { quickOrderSchema } from './pos.dto';

const router = Router();

router.use(authenticate);

router.get('/data', posController.getPOSData);
router.post('/quick-order', validate(quickOrderSchema), posController.quickOrder);

export default router;
