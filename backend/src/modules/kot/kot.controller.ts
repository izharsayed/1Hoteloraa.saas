import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import { sendSuccess } from '../../shared/helpers';
import * as KOTService from './kot.service';

// ---------------------------------------------------------------------------
// GET /kot
// ---------------------------------------------------------------------------
export const getKOTs = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const tenantId = req.user!.tenantId;
    const status = req.query.status as string | undefined;

    const kots = await KOTService.getKOTs(tenantId, status);
    sendSuccess(res, kots, 'KOTs retrieved successfully');
  } catch (err) {
    next(err);
  }
};

// ---------------------------------------------------------------------------
// GET /kot/:id
// ---------------------------------------------------------------------------
export const getKOTById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const tenantId = req.user!.tenantId;
    const { id } = req.params;

    const kot = await KOTService.getKOTById(tenantId, id);
    sendSuccess(res, kot, 'KOT retrieved successfully');
  } catch (err) {
    next(err);
  }
};

// ---------------------------------------------------------------------------
// POST /kot
// ---------------------------------------------------------------------------
export const createKOT = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const tenantId = req.user!.tenantId;
    const userId = req.user!.id;

    const kot = await KOTService.createKOT(tenantId, userId, req.body);
    sendSuccess(res, kot, 'KOT created successfully', 201);
  } catch (err) {
    next(err);
  }
};

// ---------------------------------------------------------------------------
// PATCH /kot/:id/status
// ---------------------------------------------------------------------------
export const updateKOTStatus = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const tenantId = req.user!.tenantId;
    const { id } = req.params;

    const kot = await KOTService.updateKOTStatus(tenantId, id, req.body);
    sendSuccess(res, kot, 'KOT status updated successfully');
  } catch (err) {
    next(err);
  }
};

// ---------------------------------------------------------------------------
// POST /kot/:id/print
// ---------------------------------------------------------------------------
export const printKOT = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const tenantId = req.user!.tenantId;
    const { id } = req.params;

    const kot = await KOTService.printKOT(tenantId, id);
    sendSuccess(res, kot, 'KOT marked as printed');
  } catch (err) {
    next(err);
  }
};
