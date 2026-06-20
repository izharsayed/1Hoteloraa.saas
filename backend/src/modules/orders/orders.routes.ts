import { Router } from 'express';
import { authenticate, checkPermission } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import {
  createOrderSchema,
  updateOrderStatusSchema,
  addItemsSchema,
} from './orders.dto';
import {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  addItemsToOrder,
  voidOrderItem,
  cancelOrder,
} from './orders.controller';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/',   checkPermission('ORDERS', 'READ'),   getOrders);
router.get('/:id', checkPermission('ORDERS', 'READ'),  getOrderById);
router.post('/',  checkPermission('ORDERS', 'CREATE'), validate(createOrderSchema), createOrder);
router.patch('/:id/status', checkPermission('ORDERS', 'UPDATE'), validate(updateOrderStatusSchema), updateOrderStatus);
router.post('/:id/items',   checkPermission('ORDERS', 'UPDATE'), validate(addItemsSchema), addItemsToOrder);
router.patch('/:id/items/:itemId/void', checkPermission('ORDERS', 'UPDATE'), voidOrderItem);
router.delete('/:id', checkPermission('ORDERS', 'DELETE'), cancelOrder);

export default router;
