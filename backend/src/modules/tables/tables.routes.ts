import { Router } from 'express';
import { authenticate, checkPermission } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { createTableSchema, updateTableSchema, updateTableStatusSchema } from './tables.dto';
import * as tablesController from './tables.controller';

const router = Router();

// All tables routes require authentication
router.use(authenticate);

router.get('/',    checkPermission('TABLES', 'READ'),   tablesController.getTables);
router.get('/:id', checkPermission('TABLES', 'READ'),   tablesController.getTableById);
router.post('/',   checkPermission('TABLES', 'CREATE'), validate(createTableSchema),       tablesController.createTable);
router.put('/:id', checkPermission('TABLES', 'UPDATE'), validate(updateTableSchema),       tablesController.updateTable);
router.patch('/:id/status', checkPermission('TABLES', 'UPDATE'), validate(updateTableStatusSchema), tablesController.updateTableStatus);
router.delete('/:id', checkPermission('TABLES', 'DELETE'), tablesController.deleteTable);

export default router;
