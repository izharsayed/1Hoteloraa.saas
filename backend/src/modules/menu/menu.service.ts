import prisma from '../../config/database';
import { createError } from '../../middleware/error.middleware';
import {
  CreateMenuCategoryDto,
  UpdateMenuCategoryDto,
  CreateMenuItemDto,
  UpdateMenuItemDto,
} from './menu.dto';

// ─── Menu Categories ──────────────────────────────────────────────────────────

export const getCategories = async (tenantId: string) => {
  const categories = await prisma.menuCategory.findMany({
    where: { tenantId, isActive: true },
    include: {
      _count: { select: { menuItems: { where: { isAvailable: true } } } },
    },
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
  });
  return categories;
};

export const createCategory = async (tenantId: string, dto: CreateMenuCategoryDto) => {
  const existing = await prisma.menuCategory.findFirst({
    where: { tenantId, name: dto.name, isActive: true },
  });
  if (existing) throw createError(`Menu category "${dto.name}" already exists`, 409);

  const category = await prisma.menuCategory.create({
    data: {
      tenantId,
      name: dto.name,
      description: dto.description,
      sortOrder: dto.sortOrder ?? 0,
    },
  });
  return category;
};

export const updateCategory = async (
  tenantId: string,
  id: string,
  dto: UpdateMenuCategoryDto,
) => {
  const category = await prisma.menuCategory.findFirst({
    where: { id, tenantId, isActive: true },
  });
  if (!category) throw createError('Menu category not found', 404);

  if (dto.name && dto.name !== category.name) {
    const duplicate = await prisma.menuCategory.findFirst({
      where: { tenantId, name: dto.name, isActive: true, id: { not: id } },
    });
    if (duplicate) throw createError(`Menu category "${dto.name}" already exists`, 409);
  }

  const updated = await prisma.menuCategory.update({
    where: { id },
    data: {
      ...(dto.name !== undefined && { name: dto.name }),
      ...(dto.description !== undefined && { description: dto.description }),
      ...(dto.sortOrder !== undefined && { sortOrder: dto.sortOrder }),
    },
  });
  return updated;
};

export const deleteCategory = async (tenantId: string, id: string) => {
  const category = await prisma.menuCategory.findFirst({
    where: { id, tenantId, isActive: true },
  });
  if (!category) throw createError('Menu category not found', 404);

  // Soft-delete the category
  await prisma.menuCategory.update({
    where: { id },
    data: { isActive: false },
  });

  return { message: 'Menu category deleted successfully' };
};

// ─── Menu Items ───────────────────────────────────────────────────────────────

export const getMenuItems = async (tenantId: string, categoryId?: string) => {
  const menuItems = await prisma.menuItem.findMany({
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
};

export const getMenuItemById = async (tenantId: string, id: string) => {
  const item = await prisma.menuItem.findFirst({
    where: { id, tenantId },
    include: {
      menuCategory: { select: { id: true, name: true } },
    },
  });
  if (!item) throw createError('Menu item not found', 404);
  return item;
};

export const createMenuItem = async (tenantId: string, dto: CreateMenuItemDto) => {
  // Validate category belongs to tenant if provided
  if (dto.menuCategoryId) {
    const category = await prisma.menuCategory.findFirst({
      where: { id: dto.menuCategoryId, tenantId, isActive: true },
    });
    if (!category) throw createError('Menu category not found', 404);
  }

  // Guard against duplicate item names within the same tenant
  // Exclude soft-deleted items (prefixed with [DELETED]) from this check
  const existing = await prisma.menuItem.findFirst({
    where: {
      tenantId,
      name: dto.name,
      NOT: { name: { startsWith: '[DELETED]' } },
    },
  });
  if (existing) throw createError(`Menu item "${dto.name}" already exists`, 409);

  const item = await prisma.menuItem.create({
    data: {
      tenantId,
      menuCategoryId: dto.menuCategoryId,
      name: dto.name,
      description: dto.description,
      price: dto.price,
      costPrice: dto.costPrice,
      imageUrl: dto.imageUrl,
      isVeg: dto.isVeg ?? true,
      isAvailable: dto.isAvailable ?? true,
      preparationTime: dto.preparationTime,
      sortOrder: dto.sortOrder ?? 0,
    },
    include: {
      menuCategory: { select: { id: true, name: true } },
    },
  });
  return item;
};

export const updateMenuItem = async (
  tenantId: string,
  id: string,
  dto: UpdateMenuItemDto,
) => {
  const item = await prisma.menuItem.findFirst({ where: { id, tenantId } });
  if (!item) throw createError('Menu item not found', 404);

  // Validate new category if provided
  if (dto.menuCategoryId && dto.menuCategoryId !== item.menuCategoryId) {
    const category = await prisma.menuCategory.findFirst({
      where: { id: dto.menuCategoryId, tenantId, isActive: true },
    });
    if (!category) throw createError('Menu category not found', 404);
  }

  // Guard duplicate name
  if (dto.name && dto.name !== item.name) {
    const duplicate = await prisma.menuItem.findFirst({
      where: { tenantId, name: dto.name, id: { not: id } },
    });
    if (duplicate) throw createError(`Menu item "${dto.name}" already exists`, 409);
  }

  const updated = await prisma.menuItem.update({
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
};

export const deleteMenuItem = async (tenantId: string, id: string) => {
  const item = await prisma.menuItem.findFirst({
    where: { id, tenantId },
    include: { _count: { select: { orderItems: true } } },
  });
  if (!item) throw createError('Menu item not found', 404);

  // Prevent deletion if this item is referenced in existing orders
  if (item._count.orderItems > 0) {
    // Safe soft-delete: mark unavailable so it no longer appears in catalog
    // but historical order references remain intact
    await prisma.menuItem.update({
      where: { id },
      data: { isAvailable: false, name: `[DELETED] ${item.name}` },
    });
  } else {
    // No order references — safe to hard delete
    await prisma.menuItem.delete({ where: { id } });
  }

  return { message: 'Menu item deleted successfully' };
};
