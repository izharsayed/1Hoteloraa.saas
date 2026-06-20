import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { createRoomTypeSchema, updateRoomTypeSchema } from './room-types.dto';
import * as roomTypesController from './room-types.controller';

const router = Router();

// All room-type routes require authentication
router.use(authenticate);

router.get('/', roomTypesController.getRoomTypes);
router.get('/:id', roomTypesController.getRoomTypeById);
router.post('/', validate(createRoomTypeSchema), roomTypesController.createRoomType);
router.put('/:id', validate(updateRoomTypeSchema), roomTypesController.updateRoomType);
router.delete('/:id', roomTypesController.deleteRoomType);

export default router;
