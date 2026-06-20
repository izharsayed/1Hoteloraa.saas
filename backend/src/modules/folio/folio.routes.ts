import { Router } from 'express';
import * as folioController from './folio.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { addFolioItemSchema } from './folio.dto';

const router = Router();

router.use(authenticate);

router.get('/payment/:paymentId', folioController.getFolioByPaymentId);
router.get('/reservation/:reservationId', folioController.getGuestFolio); // Detailed folio statement
router.get('/reservation/:reservationId/raw', folioController.getFolioByReservationId); // Raw folio items list
router.post('/item', validate(addFolioItemSchema), folioController.addFolioItem);

export default router;
