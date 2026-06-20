import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import { sendSuccess } from '../../shared/helpers';
import * as guestsService from './guests.service';

export const getGuests = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.user!.tenantId;
    const search = req.query.search as string | undefined;
    const guests = await guestsService.getGuests(tenantId, search);
    sendSuccess(res, guests, 'Guests retrieved successfully');
  } catch (err) {
    next(err);
  }
};

export const getGuestById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.user!.tenantId;
    const { id } = req.params;
    const guest = await guestsService.getGuestById(tenantId, id);
    sendSuccess(res, guest, 'Guest retrieved successfully');
  } catch (err) {
    next(err);
  }
};

export const createGuest = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.user!.tenantId;
    const guest = await guestsService.createGuest(tenantId, req.body);
    sendSuccess(res, guest, 'Guest created successfully', 201);
  } catch (err) {
    next(err);
  }
};

export const updateGuest = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.user!.tenantId;
    const { id } = req.params;
    const guest = await guestsService.updateGuest(tenantId, id, req.body);
    sendSuccess(res, guest, 'Guest updated successfully');
  } catch (err) {
    next(err);
  }
};

export const getGuestHistory = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.user!.tenantId;
    const { id } = req.params;
    const history = await guestsService.getGuestHistory(tenantId, id);
    sendSuccess(res, history, 'Guest history retrieved successfully');
  } catch (err) {
    next(err);
  }
};
