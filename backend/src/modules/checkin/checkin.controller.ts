import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import { sendSuccess } from '../../shared/helpers';
import * as checkInService from './checkin.service';

/**
 * GET /checkin/pending
 * Returns all CONFIRMED reservations with checkInDate <= today.
 */
export const getPendingCheckIns = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const data = await checkInService.getPendingCheckIns(req.user!.tenantId);
    sendSuccess(res, data, 'Pending check-ins fetched successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /checkin/today
 * Returns all reservations checked in today.
 */
export const getTodayCheckIns = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const data = await checkInService.getTodayCheckIns(req.user!.tenantId);
    sendSuccess(res, data, "Today's check-ins fetched successfully");
  } catch (err) {
    next(err);
  }
};

/**
 * POST /checkin
 * Performs the check-in for a given reservation.
 * Body is validated via checkInSchema before reaching this handler.
 */
export const checkIn = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const data = await checkInService.checkIn(
      req.user!.tenantId,
      req.user!.id,
      req.body,
    );
    sendSuccess(res, data, 'Guest checked in successfully', 201);
  } catch (err) {
    next(err);
  }
};
