import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import { sendSuccess } from '../../shared/helpers';
import * as roomTypesService from './room-types.service';

export const getRoomTypes = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await roomTypesService.getRoomTypes(req.user!.tenantId);
    sendSuccess(res, data, 'Room types retrieved successfully');
  } catch (err) {
    next(err);
  }
};

export const getRoomTypeById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await roomTypesService.getRoomTypeById(req.user!.tenantId, req.params.id);
    sendSuccess(res, data, 'Room type retrieved successfully');
  } catch (err) {
    next(err);
  }
};

export const createRoomType = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await roomTypesService.createRoomType(req.user!.tenantId, req.body);
    sendSuccess(res, data, 'Room type created successfully', 201);
  } catch (err) {
    next(err);
  }
};

export const updateRoomType = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await roomTypesService.updateRoomType(req.user!.tenantId, req.params.id, req.body);
    sendSuccess(res, data, 'Room type updated successfully');
  } catch (err) {
    next(err);
  }
};

export const deleteRoomType = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    await roomTypesService.deleteRoomType(req.user!.tenantId, req.params.id);
    sendSuccess(res, null, 'Room type deleted successfully');
  } catch (err) {
    next(err);
  }
};
