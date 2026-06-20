import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { createGuestSchema, updateGuestSchema } from './guests.dto';
import * as guestsController from './guests.controller';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/', guestsController.getGuests);
router.get('/:id', guestsController.getGuestById);
router.get('/:id/history', guestsController.getGuestHistory);
router.post('/', validate(createGuestSchema), guestsController.createGuest);
router.put('/:id', validate(updateGuestSchema), guestsController.updateGuest);

export default router;
