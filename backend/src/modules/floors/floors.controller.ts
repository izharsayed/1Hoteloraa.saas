import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import { sendSuccess } from '../../shared/helpers';
import * as floorsService from './floors.service';

export const getFloors = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = await floorsService.getFloors(req.user!.tenantId);
    sendSuccess(res, data, 'Floors retrieved successfully');
  } catch (err) { next(err); }
};

export const createFloor = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = await floorsService.createFloor(req.user!.tenantId, req.body);
    sendSuccess(res, data, 'Floor created successfully', 201);
  } catch (err) { next(err); }
};

export const deleteFloor = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = await floorsService.deleteFloor(req.user!.tenantId, req.params.id);
    sendSuccess(res, data, 'Floor deleted successfully');
  } catch (err) { next(err); }
};
