import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import { sendSuccess, sendError } from '../../shared/helpers';
import * as housekeepingService from './housekeeping.service';
import { UpdateStatusDto } from './housekeeping.dto';

// ────────────────────────────────────────────────────────────────
// GET /housekeeping?status=PENDING
// ────────────────────────────────────────────────────────────────
export const getTasks = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const tenantId = req.user!.tenantId;
    const status = req.query.status as string | undefined;
    const tasks = await housekeepingService.getTasks(tenantId, status);
    sendSuccess(res, tasks, 'Housekeeping tasks retrieved successfully');
  } catch (err) {
    next(err);
  }
};

// ────────────────────────────────────────────────────────────────
// GET /housekeeping/my-tasks
// ────────────────────────────────────────────────────────────────
export const getMyTasks = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { tenantId, id: userId } = req.user!;
    const tasks = await housekeepingService.getMyTasks(tenantId, userId);
    sendSuccess(res, tasks, 'My tasks retrieved successfully');
  } catch (err) {
    next(err);
  }
};

// ────────────────────────────────────────────────────────────────
// GET /housekeeping/dashboard
// ────────────────────────────────────────────────────────────────
export const getDashboard = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const tenantId = req.user!.tenantId;
    const dashboard = await housekeepingService.getDashboard(tenantId);
    sendSuccess(res, dashboard, 'Housekeeping dashboard retrieved successfully');
  } catch (err) {
    next(err);
  }
};

// ────────────────────────────────────────────────────────────────
// GET /housekeeping/:id
// ────────────────────────────────────────────────────────────────
export const getTaskById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const tenantId = req.user!.tenantId;
    const task = await housekeepingService.getTaskById(tenantId, req.params.id);
    sendSuccess(res, task, 'Housekeeping task retrieved successfully');
  } catch (err) {
    next(err);
  }
};

// ────────────────────────────────────────────────────────────────
// POST /housekeeping
// ────────────────────────────────────────────────────────────────
export const createTask = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const tenantId = req.user!.tenantId;
    const task = await housekeepingService.createTask(tenantId, req.body);
    sendSuccess(res, task, 'Housekeeping task created successfully', 201);
  } catch (err) {
    next(err);
  }
};

// ────────────────────────────────────────────────────────────────
// PUT /housekeeping/:id
// ────────────────────────────────────────────────────────────────
export const updateTask = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const tenantId = req.user!.tenantId;
    const task = await housekeepingService.updateTask(tenantId, req.params.id, req.body);
    sendSuccess(res, task, 'Housekeeping task updated successfully');
  } catch (err) {
    next(err);
  }
};

// ────────────────────────────────────────────────────────────────
// PATCH /housekeeping/:id/status
// ────────────────────────────────────────────────────────────────
export const updateStatus = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const tenantId = req.user!.tenantId;
    const userId = req.user!.id;
    const { status } = req.body as UpdateStatusDto;
    const task = await housekeepingService.updateStatus(tenantId, req.params.id, status, userId);
    sendSuccess(res, task, `Task status updated to ${status}`);
  } catch (err) {
    next(err);
  }
};
