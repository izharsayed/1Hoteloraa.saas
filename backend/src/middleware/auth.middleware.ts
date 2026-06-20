import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/env';
import prisma from '../config/database';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    tenantId: string;
    email: string;
    userRole: string;
    roleId?: string;
  };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ success: false, message: 'No token provided' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, config.jwt.secret) as {
      id: string;
      tenantId: string;
      email: string;
      userRole: string;
      roleId?: string;
    };

    const user = await prisma.user.findFirst({
      where: { id: decoded.id, tenantId: decoded.tenantId, isActive: true },
    });

    if (!user) {
      res.status(401).json({ success: false, message: 'User not found or inactive' });
      return;
    }

    req.user = {
      id: decoded.id,
      tenantId: decoded.tenantId,
      email: decoded.email,
      userRole: decoded.userRole,
      roleId: decoded.roleId,
    };

    next();
  } catch {
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.userRole)) {
      res.status(403).json({ success: false, message: 'Access denied: insufficient permissions' });
      return;
    }
    next();
  };
};

export const requireTenant = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const tenantId = req.headers['x-tenant-id'] as string || req.user?.tenantId;
  if (!tenantId) {
    res.status(400).json({ success: false, message: 'Tenant ID required' });
    return;
  }
  if (req.user) req.user.tenantId = tenantId;
  next();
};

// Simple helper to assign default behavior to standard system roles
const checkStaticRoleFallback = (role: string, module: string, action: string): boolean => {
  const waiterPerms: Record<string, string[]> = {
    MENU: ['READ'],
    ORDERS: ['CREATE', 'READ', 'UPDATE'],
    KOT: ['READ'],
    TABLES: ['READ'],
  };

  const chefPerms: Record<string, string[]> = {
    MENU: ['READ'],
    KOT: ['READ', 'UPDATE'],
    ORDERS: ['READ'],
  };

  const housekeeperPerms: Record<string, string[]> = {
    ROOMS: ['READ'],
    HOUSEKEEPING: ['READ', 'UPDATE'],
  };

  const receptionistPerms: Record<string, string[]> = {
    ROOMS: ['READ', 'UPDATE'],
    ROOM_TYPES: ['READ'],
    GUESTS: ['CREATE', 'READ', 'UPDATE'],
    RESERVATIONS: ['CREATE', 'READ', 'UPDATE'],
    CHECKIN: ['CREATE', 'READ', 'UPDATE'],
    CHECKOUT: ['CREATE', 'READ', 'UPDATE'],
    PAYMENTS: ['CREATE', 'READ'],
    FOLIO: ['CREATE', 'READ', 'UPDATE'],
  };

  const cashierPerms: Record<string, string[]> = {
    MENU: ['READ'],
    ORDERS: ['READ'],
    BILLING: ['CREATE', 'READ', 'UPDATE'],
    PAYMENTS: ['CREATE', 'READ'],
    POS: ['READ'],
  };

  const managerPerms: Record<string, string[]> = {
    DASHBOARD: ['READ'],
    ROOMS: ['CREATE', 'READ', 'UPDATE', 'DELETE'],
    ROOM_TYPES: ['CREATE', 'READ', 'UPDATE'],
    GUESTS: ['CREATE', 'READ', 'UPDATE', 'DELETE'],
    RESERVATIONS: ['CREATE', 'READ', 'UPDATE', 'DELETE'],
    CHECKIN: ['CREATE', 'READ', 'UPDATE'],
    CHECKOUT: ['CREATE', 'READ', 'UPDATE'],
    HOUSEKEEPING: ['CREATE', 'READ', 'UPDATE', 'DELETE'],
    TABLES: ['CREATE', 'READ', 'UPDATE', 'DELETE'],
    MENU: ['CREATE', 'READ', 'UPDATE', 'DELETE'],
    ORDERS: ['CREATE', 'READ', 'UPDATE', 'DELETE'],
    KOT: ['CREATE', 'READ', 'UPDATE', 'DELETE'],
    BILLING: ['CREATE', 'READ', 'UPDATE', 'DELETE'],
    PAYMENTS: ['CREATE', 'READ', 'UPDATE', 'DELETE'],
    FOLIO: ['CREATE', 'READ', 'UPDATE', 'DELETE'],
    INVENTORY: ['CREATE', 'READ', 'UPDATE', 'DELETE'],
    VENDORS: ['CREATE', 'READ', 'UPDATE', 'DELETE'],
    PURCHASES: ['CREATE', 'READ', 'UPDATE', 'DELETE'],
    REPORTS: ['READ'],
    USERS: ['READ'],
  };

  let allowedActions: string[] = [];

  if (role === 'WAITER') allowedActions = waiterPerms[module] || [];
  else if (role === 'CHEF') allowedActions = chefPerms[module] || [];
  else if (role === 'HOUSEKEEPING') allowedActions = housekeeperPerms[module] || [];
  else if (role === 'RECEPTIONIST') allowedActions = receptionistPerms[module] || [];
  else if (role === 'CASHIER') allowedActions = cashierPerms[module] || [];
  else if (role === 'MANAGER' || role === 'ACCOUNTANT') allowedActions = managerPerms[module] || [];

  return allowedActions.includes(action);
};

export const checkPermission = (module: string, action: string) => {
  return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const { userRole, roleId } = req.user;

      // 1. Super Admin and Tenant Admin have absolute override access
      if (userRole === 'SUPER_ADMIN' || userRole === 'TENANT_ADMIN') {
        return next();
      }

      // 2. If the user has a custom role mapped, check permissions table
      if (roleId) {
        const rolePermission = await prisma.rolePermission.findFirst({
          where: {
            roleId,
            permission: {
              module,
              action,
            },
          },
        });

        if (rolePermission) {
          return next();
        }
      }

      // 3. Fallback to static rules for pre-defined system roles (e.g. WAITER can READ MENU, CHEF can UPDATE KOT)
      const hasStaticAccess = checkStaticRoleFallback(userRole, module, action);
      if (hasStaticAccess) {
        return next();
      }

      res.status(403).json({ success: false, message: 'Access denied: insufficient permissions' });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Internal server error during permission check' });
    }
  };
};
