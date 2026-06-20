import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import * as paymentsService from './payments.service';
import { sendSuccess } from '../../shared/helpers';

export const getPayments = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.user!.tenantId;
    const { status } = req.query;
    const result = await paymentsService.getPayments(tenantId, status as string);
    sendSuccess(res, result, 'Payments retrieved successfully');
  } catch (err) {
    next(err);
  }
};

export const getPaymentById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.user!.tenantId;
    const { id } = req.params;
    const result = await paymentsService.getPaymentById(tenantId, id);
    sendSuccess(res, result, 'Payment retrieved successfully');
  } catch (err) {
    next(err);
  }
};

export const createPayment = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.user!.tenantId;
    const userId = req.user!.id;
    const result = await paymentsService.createPayment(tenantId, userId, req.body);
    sendSuccess(res, result, 'Payment registered successfully', 201);
  } catch (err) {
    next(err);
  }
};

export const getPaymentSummary = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.user!.tenantId;
    const { date } = req.query;
    const result = await paymentsService.getPaymentSummary(tenantId, date as string);
    sendSuccess(res, result, 'Payment summary retrieved successfully');
  } catch (err) {
    next(err);
  }
};
