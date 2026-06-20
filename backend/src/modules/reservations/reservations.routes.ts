import { Router } from 'express';
import { authenticate, checkPermission } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import {
  createReservationSchema,
  updateReservationSchema,
  updateStatusSchema,
} from './reservations.dto';
import * as reservationsController from './reservations.controller';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/', checkPermission('RESERVATIONS', 'READ'), reservationsController.getReservations);
router.get('/:id', checkPermission('RESERVATIONS', 'READ'), reservationsController.getReservationById);
router.post('/', checkPermission('RESERVATIONS', 'CREATE'), validate(createReservationSchema), reservationsController.createReservation);
router.put('/:id', checkPermission('RESERVATIONS', 'UPDATE'), validate(updateReservationSchema), reservationsController.updateReservation);
router.patch('/:id/status', checkPermission('RESERVATIONS', 'UPDATE'), validate(updateStatusSchema), reservationsController.updateStatus);
router.delete('/:id', checkPermission('RESERVATIONS', 'DELETE'), reservationsController.cancelReservation);

export default router;
