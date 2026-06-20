import prisma from '../../config/database';
import { QuickOrderDto } from './pos.dto';
import { generateOrderNumber, generateKOTNumber } from '../../shared/helpers';
import { createError } from '../../middleware/error.middleware';

export const getPOSData = async (tenantId: string) => {
  const tables = await prisma.table.findMany({
    where: { tenantId, isActive: true },
    orderBy: { name: 'asc' },
  });

  const menuCategories = await prisma.menuCategory.findMany({
    where: { tenantId, isActive: true },
    orderBy: { sortOrder: 'asc' },
  });

  const menuItems = await prisma.menuItem.findMany({
    where: { tenantId, isAvailable: true },
    orderBy: { name: 'asc' },
  });

  return {
    tables,
    menuCategories,
    menuItems,
  };
};

export const quickOrder = async (tenantId: string, userId: string, dto: QuickOrderDto) => {
  const { tableId, items } = dto;

  // Retrieve menu items to calculate prices
  const menuItemIds = items.map((i) => i.menuItemId);
  const dbMenuItems = await prisma.menuItem.findMany({
    where: {
      id: { in: menuItemIds },
      tenantId,
    },
  });

  if (dbMenuItems.length !== menuItemIds.length) {
    throw createError('Some menu items were not found or do not belong to this tenant', 404);
  }

  const menuItemsMap = new Map(dbMenuItems.map((item) => [item.id, item]));

  // Calculate Order amount
  let subtotal = 0;
  items.forEach((item) => {
    const dbItem = menuItemsMap.get(item.menuItemId)!;
    subtotal += dbItem.price * item.quantity;
  });

  // Fetch Settings for taxes
  const settings = await prisma.tenantSettings.findUnique({
    where: { tenantId },
  });
  const taxRate = settings?.taxRate ?? 18;
  const taxAmount = (subtotal * taxRate) / 100;
  const totalAmount = subtotal + taxAmount;

  return prisma.$transaction(async (tx) => {
    // 1. If tableId provided, set Table to OCCUPIED
    if (tableId) {
      const table = await tx.table.findFirst({
        where: { id: tableId, tenantId, isActive: true },
      });
      if (!table) throw createError('Table not found', 404);
      
      await tx.table.update({
        where: { id: tableId },
        data: { status: 'OCCUPIED' },
      });
    }

    // 2. Create Order
    const orderNum = generateOrderNumber(settings?.invoicePrefix || 'INV');
    const order = await tx.order.create({
      data: {
        tenantId,
        tableId: tableId || undefined,
        userId,
        orderNumber: orderNum,
        status: 'CONFIRMED',
        subtotal,
        taxAmount,
        totalAmount,
      },
    });

    // 3. Create OrderItems
    const orderItemsData = items.map((item) => {
      const dbItem = menuItemsMap.get(item.menuItemId)!;
      return {
        orderId: order.id,
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        unitPrice: dbItem.price,
        totalPrice: dbItem.price * item.quantity,
        notes: item.notes,
      };
    });

    // We need to create them one by one or createMany and retrieve
    await tx.orderItem.createMany({
      data: orderItemsData,
    });

    // Retrieve order items to get their IDs (required for KOTItem creation)
    const createdOrderItems = await tx.orderItem.findMany({
      where: { orderId: order.id },
    });

    // 4. Create KOT
    const kotNum = generateKOTNumber(settings?.kotPrefix || 'KOT');
    const kot = await tx.kOT.create({
      data: {
        tenantId,
        orderId: order.id,
        userId,
        kotNumber: kotNum,
        status: 'PENDING',
      },
    });

    // 5. Create KOTItems mapping to OrderItems
    const kotItemsData = createdOrderItems.map((orderItem) => ({
      kotId: kot.id,
      orderItemId: orderItem.id,
      quantity: orderItem.quantity,
      notes: orderItem.notes,
    }));

    await tx.kOTItem.createMany({
      data: kotItemsData,
    });

    return tx.order.findUnique({
      where: { id: order.id },
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
        kots: {
          include: {
            items: true,
          },
        },
        table: true,
      },
    });
  });
};
