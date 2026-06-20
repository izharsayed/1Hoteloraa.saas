import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
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

// GET /orders?status=PENDING
router.get('/', getOrders);

// GET /orders/:id
router.get('/:id', getOrderById);

// POST /orders
router.post('/', validate(createOrderSchema), createOrder);

// PATCH /orders/:id/status
router.patch('/:id/status', validate(updateOrderStatusSchema), updateOrderStatus);

// POST /orders/:id/items
router.post('/:id/items', validate(addItemsSchema), addItemsToOrder);

// PATCH /orders/:id/items/:itemId/void
router.patch('/:id/items/:itemId/void', voidOrderItem);

// DELETE /orders/:id  (cancel)
router.delete('/:id', cancelOrder);

export default router;
