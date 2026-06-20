import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import * as superadminService from './superadmin.service';
import { sendSuccess } from '../../shared/helpers';

// Overview Metrics
export const getOverviewMetrics = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await superadminService.getOverviewMetrics();
    sendSuccess(res, result, 'System overview statistics retrieved successfully');
  } catch (err) {
    next(err);
  }
};

// Tenants
export const getAllTenants = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await superadminService.getAllTenants();
    sendSuccess(res, result, 'All cluster tenants retrieved successfully');
  } catch (err) {
    next(err);
  }
};

export const createTenant = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await superadminService.createTenant(req.body);
    sendSuccess(res, result, 'New SaaS tenant created and provisioned successfully');
  } catch (err) {
    next(err);
  }
};

export const toggleTenantStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await superadminService.toggleTenantStatus(id);
    sendSuccess(res, result, 'Tenant status toggled successfully');
  } catch (err) {
    next(err);
  }
};

export const configureTenantFeatures = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await superadminService.configureTenantFeatures(id, req.body);
    sendSuccess(res, result, 'Tenant operational features configured successfully');
  } catch (err) {
    next(err);
  }
};

export const configureTenantPlan = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await superadminService.configureTenantPlan(id, req.body);
    sendSuccess(res, result, 'Tenant subscription plan changed successfully');
  } catch (err) {
    next(err);
  }
};

export const deleteTenant = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await superadminService.deleteTenant(id);
    sendSuccess(res, result, 'Tenant deleted successfully from cluster database');
  } catch (err) {
    next(err);
  }
};

// Subscriptions
export const getSubscriptionPlans = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await superadminService.getSubscriptionPlans();
    sendSuccess(res, result, 'Subscription pricing tiers retrieved successfully');
  } catch (err) {
    next(err);
  }
};

// Users
export const getAllUsers = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await superadminService.getAllUsers();
    sendSuccess(res, result, 'All system staff users retrieved successfully');
  } catch (err) {
    next(err);
  }
};

export const toggleUserStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await superadminService.toggleUserStatus(id);
    sendSuccess(res, result, 'User status toggled successfully');
  } catch (err) {
    next(err);
  }
};

export const resetUserPassword = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await superadminService.resetUserPassword(id, req.body);
    sendSuccess(res, result, 'User password reset successfully');
  } catch (err) {
    next(err);
  }
};

// Audit Logs
export const getAuditLogs = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await superadminService.getAuditLogs();
    sendSuccess(res, result, 'Audit logs retrieved successfully');
  } catch (err) {
    next(err);
  }
};

export const createSimulatedLog = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await superadminService.createSimulatedLog(req.body);
    sendSuccess(res, result, 'Simulated log registered successfully');
  } catch (err) {
    next(err);
  }
};

// Global RBAC
export const getGlobalRoles = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await superadminService.getGlobalRoles();
    sendSuccess(res, result, 'Global roles and permissions retrieved successfully');
  } catch (err) {
    next(err);
  }
};

export const updateRolePermissions = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await superadminService.updateRolePermissions(id, req.body);
    sendSuccess(res, result, 'Role permissions mapping updated successfully');
  } catch (err) {
    next(err);
  }
};

export const createRole = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await superadminService.createRole(req.body);
    sendSuccess(res, result, 'New global template role created successfully');
  } catch (err) {
    next(err);
  }
};

export const deleteRole = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await superadminService.deleteRole(id);
    sendSuccess(res, result, 'Global role deleted successfully');
  } catch (err) {
    next(err);
  }
};
