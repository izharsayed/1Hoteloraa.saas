import { PurchaseStatus } from '@prisma/client';
import prisma from '../../config/database';
import { createError } from '../../middleware/error.middleware';
import { generateOrderNumber } from '../../shared/helpers';
import { CreatePurchaseDto } from './purchases.dto';

const purchaseInclude = {
  vendor: {
    select: { id: true, name: true, phone: true, email: true },
  },
  items: {
    include: {
      inventoryItem: {
        select: { id: true, name: true, unit: true, sku: true },
      },
    },
  },
};

export const getPurchases = async (tenantId: string, status?: string) => {
  const where: Record<string, unknown> = { tenantId };

  if (status) {
    where.status = status as PurchaseStatus;
  }

  const purchases = await prisma.purchase.findMany({
    where,
    include: purchaseInclude,
    orderBy: { createdAt: 'desc' },
  });

  return purchases;
};

export const getPurchaseById = async (tenantId: string, id: string) => {
  const purchase = await prisma.purchase.findFirst({
    where: { id, tenantId },
    include: purchaseInclude,
  });

  if (!purchase) {
    throw createError('Purchase not found', 404);
  }

  return purchase;
};

export const createPurchase = async (
  tenantId: string,
  dto: CreatePurchaseDto
) => {
  const { vendorId, items, notes } = dto;

  // Validate vendor belongs to tenant if provided
  if (vendorId) {
    const vendor = await prisma.vendor.findFirst({
      where: { id: vendorId, tenantId, isActive: true },
    });
    if (!vendor) {
      throw createError('Vendor not found or inactive', 404);
    }
  }

  // Validate all inventory items belong to tenant
  const inventoryItemIds = [...new Set(items.map((item) => item.inventoryItemId))];
  const inventoryItems = await prisma.inventoryItem.findMany({
    where: { id: { in: inventoryItemIds }, tenantId, isActive: true },
  });

  if (inventoryItems.length !== inventoryItemIds.length) {
    throw createError(
      'One or more inventory items not found or inactive',
      404
    );
  }

  // Calculate totals
  let subtotal = 0;
  const purchaseItems = items.map((item) => {
    const totalPrice = item.quantity * item.unitPrice;
    subtotal += totalPrice;
    return {
      inventoryItemId: item.inventoryItemId,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice,
    };
  });

  const totalAmount = subtotal; // taxAmount can be added later via settings

  const purchase = await prisma.purchase.create({
    data: {
      tenantId,
      vendorId,
      purchaseNumber: generateOrderNumber('PUR'),
      subtotal,
      taxAmount: 0,
      totalAmount,
      notes,
      items: {
        create: purchaseItems,
      },
    },
    include: purchaseInclude,
  });

  return purchase;
};

export const receivePurchase = async (tenantId: string, id: string) => {
  const purchase = await prisma.purchase.findFirst({
    where: { id, tenantId },
    include: { items: true },
  });

  if (!purchase) {
    throw createError('Purchase not found', 404);
  }

  if (purchase.status === 'CANCELLED') {
    throw createError('Cannot receive a cancelled purchase', 400);
  }

  if (purchase.status === 'RECEIVED') {
    throw createError('Purchase has already been received', 400);
  }

  // Mark as received and update stock in a transaction
  const updatedPurchase = await prisma.$transaction(async (tx) => {
    // Increment inventory stock for each purchase item
    for (const item of purchase.items) {
      await tx.inventoryItem.update({
        where: { id: item.inventoryItemId },
        data: { quantity: { increment: item.quantity } },
      });
    }

    return tx.purchase.update({
      where: { id },
      data: {
        status: 'RECEIVED',
        receivedAt: new Date(),
      },
      include: purchaseInclude,
    });
  });

  return updatedPurchase;
};

export const updateStatus = async (
  tenantId: string,
  id: string,
  status: PurchaseStatus
) => {
  const purchase = await prisma.purchase.findFirst({
    where: { id, tenantId },
  });

  if (!purchase) {
    throw createError('Purchase not found', 404);
  }

  if (purchase.status === 'CANCELLED') {
    throw createError('Cannot update status of a cancelled purchase', 400);
  }

  const updated = await prisma.purchase.update({
    where: { id },
    data: { status },
    include: purchaseInclude,
  });

  return updated;
};
