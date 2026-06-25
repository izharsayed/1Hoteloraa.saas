"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } }

var _menuservice = require('./menu.service'); var menuService = _interopRequireWildcard(_menuservice);
var _helpers = require('../../shared/helpers');

// Categories
 const getCategories = async (req, res, next) => {
  try {
    const tenantId = req.user.tenantId;
    const result = await menuService.getCategories(tenantId);
    _helpers.sendSuccess.call(void 0, res, result, 'Categories retrieved successfully');
  } catch (err) {
    next(err);
  }
}; exports.getCategories = getCategories;

 const createCategory = async (req, res, next) => {
  try {
    const tenantId = req.user.tenantId;
    const result = await menuService.createCategory(tenantId, req.body);
    _helpers.sendSuccess.call(void 0, res, result, 'Category created successfully', 201);
  } catch (err) {
    next(err);
  }
}; exports.createCategory = createCategory;

 const updateCategory = async (req, res, next) => {
  try {
    const tenantId = req.user.tenantId;
    const { id } = req.params;
    const result = await menuService.updateCategory(tenantId, id, req.body);
    _helpers.sendSuccess.call(void 0, res, result, 'Category updated successfully');
  } catch (err) {
    next(err);
  }
}; exports.updateCategory = updateCategory;

 const deleteCategory = async (req, res, next) => {
  try {
    const tenantId = req.user.tenantId;
    const { id } = req.params;
    const result = await menuService.deleteCategory(tenantId, id);
    _helpers.sendSuccess.call(void 0, res, result, 'Category deleted successfully');
  } catch (err) {
    next(err);
  }
}; exports.deleteCategory = deleteCategory;

// Menu Items
 const getMenuItems = async (req, res, next) => {
  try {
    const tenantId = req.user.tenantId;
    const categoryId = req.query.categoryId ;
    const result = await menuService.getMenuItems(tenantId, categoryId);
    _helpers.sendSuccess.call(void 0, res, result, 'Menu items retrieved successfully');
  } catch (err) {
    next(err);
  }
}; exports.getMenuItems = getMenuItems;

 const getMenuItemById = async (req, res, next) => {
  try {
    const tenantId = req.user.tenantId;
    const { id } = req.params;
    const result = await menuService.getMenuItemById(tenantId, id);
    _helpers.sendSuccess.call(void 0, res, result, 'Menu item retrieved successfully');
  } catch (err) {
    next(err);
  }
}; exports.getMenuItemById = getMenuItemById;

 const createMenuItem = async (req, res, next) => {
  try {
    const tenantId = req.user.tenantId;
    const result = await menuService.createMenuItem(tenantId, req.body);
    _helpers.sendSuccess.call(void 0, res, result, 'Menu item created successfully', 201);
  } catch (err) {
    next(err);
  }
}; exports.createMenuItem = createMenuItem;

 const updateMenuItem = async (req, res, next) => {
  try {
    const tenantId = req.user.tenantId;
    const { id } = req.params;
    const result = await menuService.updateMenuItem(tenantId, id, req.body);
    _helpers.sendSuccess.call(void 0, res, result, 'Menu item updated successfully');
  } catch (err) {
    next(err);
  }
}; exports.updateMenuItem = updateMenuItem;

 const deleteMenuItem = async (req, res, next) => {
  try {
    const tenantId = req.user.tenantId;
    const { id } = req.params;
    const result = await menuService.deleteMenuItem(tenantId, id);
    _helpers.sendSuccess.call(void 0, res, result, 'Menu item deleted successfully');
  } catch (err) {
    next(err);
  }
}; exports.deleteMenuItem = deleteMenuItem;

 const uploadItemImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new Error('No file uploaded or file type not allowed'));
    }
    const relativeUrl = `/uploads/${req.file.filename}`;
    _helpers.sendSuccess.call(void 0, res, { imageUrl: relativeUrl }, 'Image uploaded successfully');
  } catch (err) {
    next(err);
  }
}; exports.uploadItemImage = uploadItemImage;
