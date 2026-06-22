import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import { sendSuccess } from '../../shared/helpers';
import * as notificationsService from './notifications.service';

export const getNotifications = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const tenantId = req.user!.tenantId;
    const userId = req.user!.id;
    const role = req.user!.userRole;

    const notifications = await notificationsService.getNotifications(tenantId, userId, role);
    sendSuccess(res, notifications, 'Notifications retrieved successfully');
  } catch (err) {
    next(err);
  }
};

export const markAsRead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const tenantId = req.user!.tenantId;
    const userId = req.user!.id;
    const role = req.user!.userRole;
    const { id } = req.params;

    const updated = await notificationsService.markAsRead(tenantId, id, userId, role);
    sendSuccess(res, updated, 'Notification marked as read');
  } catch (err) {
    next(err);
  }
};

export const markAllAsRead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const tenantId = req.user!.tenantId;
    const userId = req.user!.id;
    const role = req.user!.userRole;

    const result = await notificationsService.markAllAsRead(tenantId, userId, role);
    sendSuccess(res, result, 'All notifications marked as read');
  } catch (err) {
    next(err);
  }
};
