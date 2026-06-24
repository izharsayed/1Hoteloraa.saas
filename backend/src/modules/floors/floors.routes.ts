import { Router } from 'express';
import { authenticate, checkPermission } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { createFloorSchema } from './floors.dto';
import * as floorsController from './floors.controller';

const router = Router();

// All floors routes require authentication
router.use(authenticate);

router.get('/',    checkPermission('TABLES', 'READ'),   floorsController.getFloors);
router.post('/',   checkPermission('TABLES', 'CREATE'), validate(createFloorSchema), floorsController.createFloor);
router.delete('/:id', checkPermission('TABLES', 'DELETE'), floorsController.deleteFloor);

export default router;
