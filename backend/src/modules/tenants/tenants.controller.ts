import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import * as tenantsService from './tenants.service';
import { sendSuccess } from '../../shared/helpers';

export const getTenantProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.user!.tenantId;
    const result = await tenantsService.getTenantProfile(tenantId);
    sendSuccess(res, result, 'Tenant profile retrieved successfully');
  } catch (err) {
    next(err);
  }
};

export const updateTenant = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.user!.tenantId;
    const result = await tenantsService.updateTenant(tenantId, req.body);
    sendSuccess(res, result, 'Tenant profile updated successfully');
  } catch (err) {
    next(err);
  }
};

export const getTenantFeatures = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.user!.tenantId;
    const result = await tenantsService.getTenantFeatures(tenantId);
    sendSuccess(res, result, 'Tenant features retrieved successfully');
  } catch (err) {
    next(err);
  }
};

export const toggleFeature = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.user!.tenantId;
    const { feature } = req.params;
    const result = await tenantsService.toggleFeature(tenantId, feature);
    sendSuccess(res, result, `Feature ${feature} toggled successfully`);
  } catch (err) {
    next(err);
  }
};
