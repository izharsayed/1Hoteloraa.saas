import { Router } from 'express';
import * as inventoryController from './inventory.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { createItemSchema, updateItemSchema, adjustStockSchema } from './inventory.dto';

const router = Router();

router.use(authenticate);

router.get('/', inventoryController.getItems);
router.get('/low-stock', inventoryController.getLowStockItems);
router.get('/:id', inventoryController.getItemById);
router.post('/', validate(createItemSchema), inventoryController.createItem);
router.put('/:id', validate(updateItemSchema), inventoryController.updateItem);
router.patch('/:id/adjust-stock', validate(adjustStockSchema), inventoryController.adjustStock);
router.delete('/:id', inventoryController.deleteItem);

export default router;
