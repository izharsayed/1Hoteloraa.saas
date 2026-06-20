import prisma from '../../config/database';
import { CreateItemDto, UpdateItemDto } from './inventory.dto';
import { createError } from '../../middleware/error.middleware';

export const getItems = async (tenantId: string, search?: string) => {
  return prisma.inventoryItem.findMany({
    where: {
      tenantId,
      isActive: true,
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { sku: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    },
    orderBy: {
      name: 'asc',
    },
  });
};

export const getItemById = async (tenantId: string, id: string) => {
  const item = await prisma.inventoryItem.findFirst({
    where: { id, tenantId, isActive: true },
  });
  if (!item) throw createError('Inventory item not found', 404);
  return item;
};

export const createItem = async (tenantId: string, dto: CreateItemDto) => {
  if (dto.sku) {
    const existing = await prisma.inventoryItem.findFirst({
      where: { tenantId, sku: dto.sku, isActive: true },
    });
    if (existing) throw createError('An item with this SKU already exists', 400);
  }

  return prisma.inventoryItem.create({
    data: {
      tenantId,
      name: dto.name,
      description: dto.description,
      sku: dto.sku,
      unit: dto.unit,
      quantity: dto.quantity,
      minimumStock: dto.minimumStock,
      costPrice: dto.costPrice,
    },
  });
};

export const updateItem = async (tenantId: string, id: string, dto: UpdateItemDto) => {
  const item = await getItemById(tenantId, id);

  if (dto.sku && dto.sku !== item.sku) {
    const existing = await prisma.inventoryItem.findFirst({
      where: { tenantId, sku: dto.sku, isActive: true, id: { not: id } },
    });
    if (existing) throw createError('An item with this SKU already exists', 400);
  }

  return prisma.inventoryItem.update({
    where: { id },
    data: dto as any,
  });
};

export const adjustStock = async (tenantId: string, id: string, quantity: number, reason: string) => {
  const item = await getItemById(tenantId, id);
  const newQuantity = item.quantity + quantity;

  if (newQuantity < 0) {
    throw createError('Stock quantity cannot be adjusted below zero', 400);
  }

  return prisma.inventoryItem.update({
    where: { id },
    data: {
      quantity: newQuantity,
      description: item.description 
        ? `${item.description}\nAdjustment: ${quantity > 0 ? '+' : ''}${quantity} (${reason})`
        : `Adjustment: ${quantity > 0 ? '+' : ''}${quantity} (${reason})`,
    },
  });
};

export const getLowStockItems = async (tenantId: string) => {
  const items = await prisma.inventoryItem.findMany({
    where: {
      tenantId,
      isActive: true,
    },
  });

  return items.filter((item) => item.quantity <= item.minimumStock);
};

export const deleteItem = async (tenantId: string, id: string) => {
  await getItemById(tenantId, id);
  return prisma.inventoryItem.update({
    where: { id },
    data: { isActive: false },
  });
};
