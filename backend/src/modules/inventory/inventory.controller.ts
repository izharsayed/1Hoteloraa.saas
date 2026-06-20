import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import * as inventoryService from './inventory.service';
import { sendSuccess } from '../../shared/helpers';

export const getItems = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.user!.tenantId;
    const search = req.query.search as string;
    const result = await inventoryService.getItems(tenantId, search);
    sendSuccess(res, result, 'Inventory items retrieved successfully');
  } catch (err) {
    next(err);
  }
};

export const getItemById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.user!.tenantId;
    const { id } = req.params;
    const result = await inventoryService.getItemById(tenantId, id);
    sendSuccess(res, result, 'Inventory item retrieved successfully');
  } catch (err) {
    next(err);
  }
};

export const createItem = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.user!.tenantId;
    const result = await inventoryService.createItem(tenantId, req.body);
    sendSuccess(res, result, 'Inventory item created successfully', 201);
  } catch (err) {
    next(err);
  }
};

export const updateItem = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.user!.tenantId;
    const { id } = req.params;
    const result = await inventoryService.updateItem(tenantId, id, req.body);
    sendSuccess(res, result, 'Inventory item updated successfully');
  } catch (err) {
    next(err);
  }
};

export const adjustStock = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.user!.tenantId;
    const { id } = req.params;
    const { quantity, reason } = req.body;
    const result = await inventoryService.adjustStock(tenantId, id, quantity, reason);
    sendSuccess(res, result, 'Stock adjusted successfully');
  } catch (err) {
    next(err);
  }
};

export const getLowStockItems = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.user!.tenantId;
    const result = await inventoryService.getLowStockItems(tenantId);
    sendSuccess(res, result, 'Low stock items retrieved successfully');
  } catch (err) {
    next(err);
  }
};

export const deleteItem = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.user!.tenantId;
    const { id } = req.params;
    await inventoryService.deleteItem(tenantId, id);
    sendSuccess(res, null, 'Inventory item deleted successfully');
  } catch (err) {
    next(err);
  }
};
