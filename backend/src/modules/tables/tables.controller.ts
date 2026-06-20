import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import { sendSuccess } from '../../shared/helpers';
import * as tablesService from './tables.service';
import { TableStatus } from '@prisma/client';

export const getTables = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = await tablesService.getTables(req.user!.tenantId);
    sendSuccess(res, data, 'Tables retrieved successfully');
  } catch (err) { next(err); }
};

export const getTableById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = await tablesService.getTableById(req.user!.tenantId, req.params.id);
    sendSuccess(res, data, 'Table retrieved successfully');
  } catch (err) { next(err); }
};

export const createTable = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = await tablesService.createTable(req.user!.tenantId, req.body);
    sendSuccess(res, data, 'Table created successfully', 201);
  } catch (err) { next(err); }
};

export const updateTable = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = await tablesService.updateTable(req.user!.tenantId, req.params.id, req.body);
    sendSuccess(res, data, 'Table updated successfully');
  } catch (err) { next(err); }
};

export const updateTableStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = await tablesService.updateTableStatus(
      req.user!.tenantId,
      req.params.id,
      req.body.status as TableStatus,
    );
    sendSuccess(res, data, 'Table status updated successfully');
  } catch (err) { next(err); }
};

export const deleteTable = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = await tablesService.deleteTable(req.user!.tenantId, req.params.id);
    sendSuccess(res, data, 'Table deleted successfully');
  } catch (err) { next(err); }
};
