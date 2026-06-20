import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { checkInSchema } from './checkin.dto';
import * as checkInController from './checkin.controller';

const router = Router();

// All routes require a valid JWT
router.use(authenticate);

// GET /checkin/pending  — CONFIRMED reservations due for check-in
router.get('/pending', checkInController.getPendingCheckIns);

// GET /checkin/today   — reservations checked in today
router.get('/today', checkInController.getTodayCheckIns);

// POST /checkin        — perform check-in (body validated against checkInSchema)
router.post('/', validate(checkInSchema), checkInController.checkIn);

export default router;
