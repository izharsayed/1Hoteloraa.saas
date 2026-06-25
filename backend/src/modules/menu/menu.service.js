"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }var _database = require('../../config/database'); var _database2 = _interopRequireDefault(_database);
var _errormiddleware = require('../../middleware/error.middleware');







// ─── Menu Categories ──────────────────────────────────────────────────────────

 const getCategories = async (tenantId) => {
  const categories = await _database2.default.menuCategory.findMany({
    where: { tenantId, isActive: true },
    include: {
      _count: { select: { menuItems: { where: { isAvailable: true } } } },
    },
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
  });
  return categories;
}; exports.getCategories = getCategories;

 const createCategory = async (tenantId, dto) => {
  const existing = await _database2.default.menuCategory.findFirst({
    where: { tenantId, name: dto.name, isActive: true },
  });
  if (existing) throw _errormiddleware.createError.call(void 0, `Menu category "${dto.name}" already exists`, 409);

  const category = await _database2.default.menuCategory.create({
    data: {
      tenantId,
      name: dto.name,
      description: dto.description,
      sortOrder: _nullishCoalesce(dto.sortOrder, () => ( 0)),
    },
  });
  return category;
}; exports.createCategory = createCategory;

 const updateCategory = async (
  tenantId,
  id,
  dto,
) => {
  const category = await _database2.default.menuCategory.findFirst({
    where: { id, tenantId, isActive: true },
  });
  if (!category) throw _errormiddleware.createError.call(void 0, 'Menu category not found', 404);

  if (dto.name && dto.name !== category.name) {
    const duplicate = await _database2.default.menuCategory.findFirst({
      where: { tenantId, name: dto.name, isActive: true, id: { not: id } },
    });
    if (duplicate) throw _errormiddleware.createError.call(void 0, `Menu category "${dto.name}" already exists`, 409);
  }

  const updated = await _database2.default.menuCategory.update({
    where: { id },
    data: {
      ...(dto.name !== undefined && { name: dto.name }),
      ...(dto.description !== undefined && { description: dto.description }),
      ...(dto.sortOrder !== undefined && { sortOrder: dto.sortOrder }),
    },
  });
  return updated;
}; exports.updateCategory = updateCategory;

 const deleteCategory = async (tenantId, id) => {
  const category = await _database2.default.menuCategory.findFirst({
    where: { id, tenantId, isActive: true },
  });
  if (!category) throw _errormiddleware.createError.call(void 0, 'Menu category not found', 404);

  // Soft-delete the category
  await _database2.default.menuCategory.update({
    where: { id },
    data: { isActive: false },
  });

  return { message: 'Menu category deleted successfully' };
}; exports.deleteCategory = deleteCategory;

// ─── Menu Items ───────────────────────────────────────────────────────────────

 const getMenuItems = async (tenantId, categoryId) => {
  const menuItems = await _database2.default.menuItem.findMany({
    where: {
      tenantId,
      // Exclude soft-deleted items (those marked with [DELETED] prefix due to order references)
      NOT: { name: { startsWith: '[DELETED]' } },
      // Filter out items whose category is soft-deleted (isActive: false)
      OR: [
        { menuCategoryId: null },
        { menuCategory: { isActive: true } }
      ],
      ...(categoryId ? { menuCategoryId: categoryId } : {}),
    },
    include: {
      menuCategory: { select: { id: true, name: true } },
    },
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
  });
  return menuItems;
}; exports.getMenuItems = getMenuItems;

 const getMenuItemById = async (tenantId, id) => {
  const item = await _database2.default.menuItem.findFirst({
    where: { id, tenantId },
    include: {
      menuCategory: { select: { id: true, name: true } },
    },
  });
  if (!item) throw _errormiddleware.createError.call(void 0, 'Menu item not found', 404);
  return item;
}; exports.getMenuItemById = getMenuItemById;

 const createMenuItem = async (tenantId, dto) => {
  // Validate category belongs to tenant if provided
  if (dto.menuCategoryId) {
    const category = await _database2.default.menuCategory.findFirst({
      where: { id: dto.menuCategoryId, tenantId, isActive: true },
    });
    if (!category) throw _errormiddleware.createError.call(void 0, 'Menu category not found', 404);
  }

  // Guard against duplicate item names within the same tenant
  // Exclude soft-deleted items (prefixed with [DELETED]) from this check
  const existing = await _database2.default.menuItem.findFirst({
    where: {
      tenantId,
      name: dto.name,
      NOT: { name: { startsWith: '[DELETED]' } },
    },
  });
  if (existing) throw _errormiddleware.createError.call(void 0, `Menu item "${dto.name}" already exists`, 409);

  const item = await _database2.default.menuItem.create({
    data: {
      tenantId,
      menuCategoryId: dto.menuCategoryId,
      name: dto.name,
      description: dto.description,
      price: dto.price,
      costPrice: dto.costPrice,
      imageUrl: dto.imageUrl,
      isVeg: _nullishCoalesce(dto.isVeg, () => ( true)),
      isAvailable: _nullishCoalesce(dto.isAvailable, () => ( true)),
      preparationTime: dto.preparationTime,
      sortOrder: _nullishCoalesce(dto.sortOrder, () => ( 0)),
    },
    include: {
      menuCategory: { select: { id: true, name: true } },
    },
  });
  return item;
}; exports.createMenuItem = createMenuItem;

 const updateMenuItem = async (
  tenantId,
  id,
  dto,
) => {
  const item = await _database2.default.menuItem.findFirst({ where: { id, tenantId } });
  if (!item) throw _errormiddleware.createError.call(void 0, 'Menu item not found', 404);

  // Validate new category if provided
  if (dto.menuCategoryId && dto.menuCategoryId !== item.menuCategoryId) {
    const category = await _database2.default.menuCategory.findFirst({
      where: { id: dto.menuCategoryId, tenantId, isActive: true },
    });
    if (!category) throw _errormiddleware.createError.call(void 0, 'Menu category not found', 404);
  }

  // Guard duplicate name
  if (dto.name && dto.name !== item.name) {
    const duplicate = await _database2.default.menuItem.findFirst({
      where: { tenantId, name: dto.name, id: { not: id } },
    });
    if (duplicate) throw _errormiddleware.createError.call(void 0, `Menu item "${dto.name}" already exists`, 409);
  }

  const updated = await _database2.default.menuItem.update({
    where: { id },
    data: {
      ...(dto.menuCategoryId !== undefined && { menuCategoryId: dto.menuCategoryId }),
      ...(dto.name !== undefined && { name: dto.name }),
      ...(dto.description !== undefined && { description: dto.description }),
      ...(dto.price !== undefined && { price: dto.price }),
      ...(dto.costPrice !== undefined && { costPrice: dto.costPrice }),
      ...(dto.imageUrl !== undefined && { imageUrl: dto.imageUrl }),
      ...(dto.isVeg !== undefined && { isVeg: dto.isVeg }),
      ...(dto.isAvailable !== undefined && { isAvailable: dto.isAvailable }),
      ...(dto.preparationTime !== undefined && { preparationTime: dto.preparationTime }),
      ...(dto.sortOrder !== undefined && { sortOrder: dto.sortOrder }),
    },
    include: {
      menuCategory: { select: { id: true, name: true } },
    },
  });
  return updated;
}; exports.updateMenuItem = updateMenuItem;

 const deleteMenuItem = async (tenantId, id) => {
  const item = await _database2.default.menuItem.findFirst({
    where: { id, tenantId },
    include: { _count: { select: { orderItems: true } } },
  });
  if (!item) throw _errormiddleware.createError.call(void 0, 'Menu item not found', 404);

  // Prevent deletion if this item is referenced in existing orders
  if (item._count.orderItems > 0) {
    // Safe soft-delete: mark unavailable so it no longer appears in catalog
    // but historical order references remain intact
    await _database2.default.menuItem.update({
      where: { id },
      data: { isAvailable: false, name: `[DELETED] ${item.name}` },
    });
  } else {
    // No order references — safe to hard delete
    await _database2.default.menuItem.delete({ where: { id } });
  }

  return { message: 'Menu item deleted successfully' };
}; exports.deleteMenuItem = deleteMenuItem;
