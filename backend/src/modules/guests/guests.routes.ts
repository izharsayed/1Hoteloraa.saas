import { Router } from 'express';
import { authenticate, checkPermission } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { createGuestSchema, updateGuestSchema } from './guests.dto';
import * as guestsController from './guests.controller';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/',            checkPermission('GUESTS', 'READ'),   guestsController.getGuests);
router.get('/:id',         checkPermission('GUESTS', 'READ'),   guestsController.getGuestById);
router.get('/:id/history', checkPermission('GUESTS', 'READ'),   guestsController.getGuestHistory);
router.post('/',           checkPermission('GUESTS', 'CREATE'), validate(createGuestSchema), guestsController.createGuest);
router.put('/:id',         checkPermission('GUESTS', 'UPDATE'), validate(updateGuestSchema), guestsController.updateGuest);

export default router;
