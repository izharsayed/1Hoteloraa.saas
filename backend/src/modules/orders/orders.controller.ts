import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import { sendSuccess, sendError } from '../../shared/helpers';
import * as OrderService from './orders.service';

// ---------------------------------------------------------------------------
// GET /orders
// ---------------------------------------------------------------------------
export const getOrders = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const tenantId = req.user!.tenantId;
    const status = req.query.status as string | undefined;

    const orders = await OrderService.getOrders(tenantId, status);
    sendSuccess(res, orders, 'Orders retrieved successfully');
  } catch (err) {
    next(err);
  }
};

// ---------------------------------------------------------------------------
// GET /orders/:id
// ---------------------------------------------------------------------------
export const getOrderById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const tenantId = req.user!.tenantId;
    const { id } = req.params;

    const order = await OrderService.getOrderById(tenantId, id);
    sendSuccess(res, order, 'Order retrieved successfully');
  } catch (err) {
    next(err);
  }
};

// ---------------------------------------------------------------------------
// POST /orders
// ---------------------------------------------------------------------------
export const createOrder = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const tenantId = req.user!.tenantId;
    const userId = req.user!.id;

    const order = await OrderService.createOrder(tenantId, userId, req.body);
    sendSuccess(res, order, 'Order created successfully', 201);
  } catch (err) {
    next(err);
  }
};

// ---------------------------------------------------------------------------
// PATCH /orders/:id/status
// ---------------------------------------------------------------------------
export const updateOrderStatus = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const tenantId = req.user!.tenantId;
    const { id } = req.params;

    const order = await OrderService.updateOrderStatus(tenantId, id, req.body);
    sendSuccess(res, order, 'Order status updated successfully');
  } catch (err) {
    next(err);
  }
};

// ---------------------------------------------------------------------------
// POST /orders/:id/items
// ---------------------------------------------------------------------------
export const addItemsToOrder = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const tenantId = req.user!.tenantId;
    const { id } = req.params;

    const order = await OrderService.addItemsToOrder(tenantId, id, req.body);
    sendSuccess(res, order, 'Items added to order successfully');
  } catch (err) {
    next(err);
  }
};

// ---------------------------------------------------------------------------
// PATCH /orders/:id/items/:itemId/void
// ---------------------------------------------------------------------------
export const voidOrderItem = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const tenantId = req.user!.tenantId;
    const { id, itemId } = req.params;

    const item = await OrderService.voidOrderItem(tenantId, id, itemId);
    sendSuccess(res, item, 'Order item voided successfully');
  } catch (err) {
    next(err);
  }
};

// ---------------------------------------------------------------------------
// DELETE /orders/:id
// ---------------------------------------------------------------------------
export const cancelOrder = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const tenantId = req.user!.tenantId;
    const { id } = req.params;

    const order = await OrderService.cancelOrder(tenantId, id);
    sendSuccess(res, order, 'Order cancelled successfully');
  } catch (err) {
    next(err);
  }
};
