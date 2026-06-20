import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import { sendSuccess } from '../../shared/helpers';
import { PurchaseStatus } from '@prisma/client';
import * as purchaseService from './purchases.service';

export const listPurchases = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const tenantId = req.user!.tenantId;
    const status = req.query.status as string | undefined;
    const purchases = await purchaseService.getPurchases(tenantId, status);
    sendSuccess(res, purchases, 'Purchases retrieved successfully');
  } catch (err) {
    next(err);
  }
};

export const getPurchase = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const tenantId = req.user!.tenantId;
    const { id } = req.params;
    const purchase = await purchaseService.getPurchaseById(tenantId, id);
    sendSuccess(res, purchase, 'Purchase retrieved successfully');
  } catch (err) {
    next(err);
  }
};

export const createPurchase = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const tenantId = req.user!.tenantId;
    const purchase = await purchaseService.createPurchase(tenantId, req.body);
    sendSuccess(res, purchase, 'Purchase created successfully', 201);
  } catch (err) {
    next(err);
  }
};

export const receivePurchase = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const tenantId = req.user!.tenantId;
    const { id } = req.params;
    const purchase = await purchaseService.receivePurchase(tenantId, id);
    sendSuccess(res, purchase, 'Purchase received and inventory updated');
  } catch (err) {
    next(err);
  }
};

export const updatePurchaseStatus = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const tenantId = req.user!.tenantId;
    const { id } = req.params;
    const { status } = req.body as { status: PurchaseStatus };
    const purchase = await purchaseService.updateStatus(tenantId, id, status);
    sendSuccess(res, purchase, 'Purchase status updated successfully');
  } catch (err) {
    next(err);
  }
};
