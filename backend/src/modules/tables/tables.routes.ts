import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { createTableSchema, updateTableSchema, updateTableStatusSchema } from './tables.dto';
import * as tablesController from './tables.controller';

const router = Router();

// All tables routes require authentication
router.use(authenticate);

router.get('/', tablesController.getTables);
router.get('/:id', tablesController.getTableById);
router.post('/', validate(createTableSchema), tablesController.createTable);
router.put('/:id', validate(updateTableSchema), tablesController.updateTable);
router.patch('/:id/status', validate(updateTableStatusSchema), tablesController.updateTableStatus);
router.delete('/:id', tablesController.deleteTable);

export default router;
