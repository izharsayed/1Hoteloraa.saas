import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import { sendSuccess } from '../../shared/helpers';
import * as billingService from './billing.service';

// ---------------------------------------------------------------------------
// GET /billing/order/:orderId
// ---------------------------------------------------------------------------
export const getBillByOrderId = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { orderId } = req.params;
    const tenantId = req.user!.tenantId;
    const bill = await billingService.getBillByOrderId(tenantId, orderId);
    sendSuccess(res, bill, 'Bill fetched successfully');
  } catch (err) {
    next(err);
  }
};

// ---------------------------------------------------------------------------
// POST /billing/generate
// ---------------------------------------------------------------------------
export const generateBill = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const tenantId = req.user!.tenantId;
    const userId = req.user!.id;
    const result = await billingService.generateBill(tenantId, userId, req.body);
    sendSuccess(res, result, 'Bill generated successfully', 201);
  } catch (err) {
    next(err);
  }
};

// ---------------------------------------------------------------------------
// GET /billing/recent
// ---------------------------------------------------------------------------
export const getRecentBills = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const tenantId = req.user!.tenantId;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
    const bills = await billingService.getRecentBills(tenantId, limit);
    sendSuccess(res, bills, 'Recent bills fetched successfully');
  } catch (err) {
    next(err);
  }
};

// ---------------------------------------------------------------------------
// GET /billing/daily-sales?date=YYYY-MM-DD
// ---------------------------------------------------------------------------
export const getDailySales = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const tenantId = req.user!.tenantId;
    const date = req.query.date as string | undefined;
    const report = await billingService.getDailySales(tenantId, date);
    sendSuccess(res, report, 'Daily sales fetched successfully');
  } catch (err) {
    next(err);
  }
};
