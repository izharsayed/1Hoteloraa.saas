import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import * as menuService from './menu.service';
import { sendSuccess } from '../../shared/helpers';

// Categories
export const getCategories = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.user!.tenantId;
    const result = await menuService.getCategories(tenantId);
    sendSuccess(res, result, 'Categories retrieved successfully');
  } catch (err) {
    next(err);
  }
};

export const createCategory = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.user!.tenantId;
    const result = await menuService.createCategory(tenantId, req.body);
    sendSuccess(res, result, 'Category created successfully', 201);
  } catch (err) {
    next(err);
  }
};

export const updateCategory = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.user!.tenantId;
    const { id } = req.params;
    const result = await menuService.updateCategory(tenantId, id, req.body);
    sendSuccess(res, result, 'Category updated successfully');
  } catch (err) {
    next(err);
  }
};

export const deleteCategory = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.user!.tenantId;
    const { id } = req.params;
    const result = await menuService.deleteCategory(tenantId, id);
    sendSuccess(res, result, 'Category deleted successfully');
  } catch (err) {
    next(err);
  }
};

// Menu Items
export const getMenuItems = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.user!.tenantId;
    const categoryId = req.query.categoryId as string;
    const result = await menuService.getMenuItems(tenantId, categoryId);
    sendSuccess(res, result, 'Menu items retrieved successfully');
  } catch (err) {
    next(err);
  }
};

export const getMenuItemById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.user!.tenantId;
    const { id } = req.params;
    const result = await menuService.getMenuItemById(tenantId, id);
    sendSuccess(res, result, 'Menu item retrieved successfully');
  } catch (err) {
    next(err);
  }
};

export const createMenuItem = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.user!.tenantId;
    const result = await menuService.createMenuItem(tenantId, req.body);
    sendSuccess(res, result, 'Menu item created successfully', 201);
  } catch (err) {
    next(err);
  }
};

export const updateMenuItem = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.user!.tenantId;
    const { id } = req.params;
    const result = await menuService.updateMenuItem(tenantId, id, req.body);
    sendSuccess(res, result, 'Menu item updated successfully');
  } catch (err) {
    next(err);
  }
};

export const deleteMenuItem = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.user!.tenantId;
    const { id } = req.params;
    const result = await menuService.deleteMenuItem(tenantId, id);
    sendSuccess(res, result, 'Menu item deleted successfully');
  } catch (err) {
    next(err);
  }
};

export const uploadItemImage = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return next(new Error('No file uploaded or file type not allowed'));
    }
    const relativeUrl = `/uploads/${req.file.filename}`;
    sendSuccess(res, { imageUrl: relativeUrl }, 'Image uploaded successfully');
  } catch (err) {
    next(err);
  }
};
