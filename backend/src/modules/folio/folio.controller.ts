import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import * as folioService from './folio.service';
import { sendSuccess } from '../../shared/helpers';

export const getFolioByPaymentId = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.user!.tenantId;
    const { paymentId } = req.params;
    const result = await folioService.getFolioByPaymentId(tenantId, paymentId);
    sendSuccess(res, result, 'Folio items retrieved successfully');
  } catch (err) {
    next(err);
  }
};

export const getFolioByReservationId = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.user!.tenantId;
    const { reservationId } = req.params;
    const result = await folioService.getFolioByReservationId(tenantId, reservationId);
    sendSuccess(res, result, 'Folio items retrieved successfully');
  } catch (err) {
    next(err);
  }
};

export const addFolioItem = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.user!.tenantId;
    const result = await folioService.addFolioItem(tenantId, req.body);
    sendSuccess(res, result, 'Folio item added successfully', 201);
  } catch (err) {
    next(err);
  }
};

export const getGuestFolio = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.user!.tenantId;
    const { reservationId } = req.params;
    const result = await folioService.getGuestFolio(tenantId, reservationId);
    sendSuccess(res, result, 'Guest folio statement generated successfully');
  } catch (err) {
    next(err);
  }
};
