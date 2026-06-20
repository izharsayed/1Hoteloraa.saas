import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import { sendSuccess } from '../../shared/helpers';
import * as reservationsService from './reservations.service';

export const getReservations = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.user!.tenantId;
    const status = req.query.status as string | undefined;
    const reservations = await reservationsService.getReservations(tenantId, status);
    sendSuccess(res, reservations, 'Reservations retrieved successfully');
  } catch (err) {
    next(err);
  }
};

export const getReservationById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.user!.tenantId;
    const { id } = req.params;
    const reservation = await reservationsService.getReservationById(tenantId, id);
    sendSuccess(res, reservation, 'Reservation retrieved successfully');
  } catch (err) {
    next(err);
  }
};

export const createReservation = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.user!.tenantId;
    const reservation = await reservationsService.createReservation(tenantId, req.body);
    sendSuccess(res, reservation, 'Reservation created successfully', 201);
  } catch (err) {
    next(err);
  }
};

export const updateReservation = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.user!.tenantId;
    const { id } = req.params;
    const reservation = await reservationsService.updateReservation(tenantId, id, req.body);
    sendSuccess(res, reservation, 'Reservation updated successfully');
  } catch (err) {
    next(err);
  }
};

export const updateStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.user!.tenantId;
    const { id } = req.params;
    const { status } = req.body;
    const reservation = await reservationsService.updateStatus(tenantId, id, status);
    sendSuccess(res, reservation, `Reservation status updated to ${status}`);
  } catch (err) {
    next(err);
  }
};

export const cancelReservation = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.user!.tenantId;
    const { id } = req.params;
    const reservation = await reservationsService.cancelReservation(tenantId, id);
    sendSuccess(res, reservation, 'Reservation cancelled successfully');
  } catch (err) {
    next(err);
  }
};
