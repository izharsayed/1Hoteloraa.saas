import { Router } from 'express';
import * as inventoryController from './inventory.controller';
import { authenticate, checkPermission } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { createItemSchema, updateItemSchema, adjustStockSchema } from './inventory.dto';

const router = Router();

router.use(authenticate);

router.get('/',           checkPermission('INVENTORY', 'READ'),   inventoryController.getItems);
router.get('/low-stock',  checkPermission('INVENTORY', 'READ'),   inventoryController.getLowStockItems);
router.get('/:id',        checkPermission('INVENTORY', 'READ'),   inventoryController.getItemById);
router.post('/',          checkPermission('INVENTORY', 'CREATE'), validate(createItemSchema), inventoryController.createItem);
router.put('/:id',        checkPermission('INVENTORY', 'UPDATE'), validate(updateItemSchema), inventoryController.updateItem);
router.patch('/:id/adjust-stock', checkPermission('INVENTORY', 'UPDATE'), validate(adjustStockSchema), inventoryController.adjustStock);
router.delete('/:id',     checkPermission('INVENTORY', 'DELETE'), inventoryController.deleteItem);

export default router;
