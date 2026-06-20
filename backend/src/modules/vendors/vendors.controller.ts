import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import { sendSuccess, sendError } from '../../shared/helpers';
import * as vendorService from './vendors.service';

export const listVendors = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const tenantId = req.user!.tenantId;
    const search = req.query.search as string | undefined;
    const vendors = await vendorService.getVendors(tenantId, search);
    sendSuccess(res, vendors, 'Vendors retrieved successfully');
  } catch (err) {
    next(err);
  }
};

export const getVendor = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const tenantId = req.user!.tenantId;
    const { id } = req.params;
    const vendor = await vendorService.getVendorById(tenantId, id);
    sendSuccess(res, vendor, 'Vendor retrieved successfully');
  } catch (err) {
    next(err);
  }
};

export const createVendor = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const tenantId = req.user!.tenantId;
    const vendor = await vendorService.createVendor(tenantId, req.body);
    sendSuccess(res, vendor, 'Vendor created successfully', 201);
  } catch (err) {
    next(err);
  }
};

export const updateVendor = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const tenantId = req.user!.tenantId;
    const { id } = req.params;
    const vendor = await vendorService.updateVendor(tenantId, id, req.body);
    sendSuccess(res, vendor, 'Vendor updated successfully');
  } catch (err) {
    next(err);
  }
};

export const deleteVendor = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const tenantId = req.user!.tenantId;
    const { id } = req.params;
    await vendorService.deleteVendor(tenantId, id);
    sendSuccess(res, null, 'Vendor deleted successfully');
  } catch (err) {
    next(err);
  }
};
