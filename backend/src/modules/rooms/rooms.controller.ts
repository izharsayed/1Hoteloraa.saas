import { Response, NextFunction } from 'express';
import { RoomStatus } from '@prisma/client';
import { AuthRequest } from '../../middleware/auth.middleware';
import { sendSuccess } from '../../shared/helpers';
import { createError } from '../../middleware/error.middleware';
import * as roomsService from './rooms.service';

export const getRooms = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const status = req.query.status as string | undefined;
    const data = await roomsService.getRooms(req.user!.tenantId, status);
    sendSuccess(res, data, 'Rooms retrieved successfully');
  } catch (err) {
    next(err);
  }
};

export const getAvailableRooms = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { checkIn, checkOut } = req.query as { checkIn?: string; checkOut?: string };

    if (!checkIn || !checkOut) {
      throw createError('Query parameters checkIn and checkOut are required (ISO date strings)', 400);
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      throw createError('checkIn and checkOut must be valid ISO date strings', 400);
    }

    const data = await roomsService.getAvailableRooms(req.user!.tenantId, checkInDate, checkOutDate);
    sendSuccess(res, data, 'Available rooms retrieved successfully');
  } catch (err) {
    next(err);
  }
};

export const getRoomById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await roomsService.getRoomById(req.user!.tenantId, req.params.id);
    sendSuccess(res, data, 'Room retrieved successfully');
  } catch (err) {
    next(err);
  }
};

export const createRoom = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await roomsService.createRoom(req.user!.tenantId, req.body);
    sendSuccess(res, data, 'Room created successfully', 201);
  } catch (err) {
    next(err);
  }
};

export const updateRoom = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await roomsService.updateRoom(req.user!.tenantId, req.params.id, req.body);
    sendSuccess(res, data, 'Room updated successfully');
  } catch (err) {
    next(err);
  }
};

export const updateRoomStatus = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await roomsService.updateRoomStatus(
      req.user!.tenantId,
      req.params.id,
      req.body.status as RoomStatus
    );
    sendSuccess(res, data, 'Room status updated successfully');
  } catch (err) {
    next(err);
  }
};

export const deleteRoom = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    await roomsService.deleteRoom(req.user!.tenantId, req.params.id);
    sendSuccess(res, null, 'Room deactivated successfully');
  } catch (err) {
    next(err);
  }
};
