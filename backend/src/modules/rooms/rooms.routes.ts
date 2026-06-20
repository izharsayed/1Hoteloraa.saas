import { Router } from 'express';
import { authenticate, checkPermission } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { createRoomSchema, updateRoomSchema, updateRoomStatusSchema } from './rooms.dto';
import * as roomsController from './rooms.controller';

const router = Router();

// All rooms routes require authentication
router.use(authenticate);

// IMPORTANT: /available must be registered before /:id to avoid route shadowing
router.get('/available', checkPermission('ROOMS', 'READ'), roomsController.getAvailableRooms);
router.get('/', checkPermission('ROOMS', 'READ'), roomsController.getRooms);
router.get('/:id', checkPermission('ROOMS', 'READ'), roomsController.getRoomById);
router.post('/', checkPermission('ROOMS', 'CREATE'), validate(createRoomSchema), roomsController.createRoom);
router.put('/:id', checkPermission('ROOMS', 'UPDATE'), validate(updateRoomSchema), roomsController.updateRoom);
router.patch('/:id/status', checkPermission('ROOMS', 'UPDATE'), validate(updateRoomStatusSchema), roomsController.updateRoomStatus);
router.delete('/:id', checkPermission('ROOMS', 'DELETE'), roomsController.deleteRoom);

export default router;
