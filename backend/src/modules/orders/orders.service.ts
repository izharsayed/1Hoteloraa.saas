import prisma from '../../config/database';
import { createError } from '../../middleware/error.middleware';
import { generateOrderNumber } from '../../shared/helpers';
import { CreateOrderDto, UpdateOrderStatusDto, AddItemsDto } from './orders.dto';

// ---------------------------------------------------------------------------
// Helper: recalculate and persist order totals
// ---------------------------------------------------------------------------
async function recalculateOrderTotals(orderId: string): Promise<void> {
  const items = await prisma.orderItem.findMany({
    where: { orderId, isVoid: false },
  });

  const subtotal = items.reduce((acc, item) => acc + item.totalPrice, 0);
  const totalAmount = subtotal; // tax / discounts handled via billing module

  await prisma.order.update({
    where: { id: orderId },
    data: { subtotal, totalAmount },
  });
}

// ---------------------------------------------------------------------------
// getOrders
// ---------------------------------------------------------------------------
export const getOrders = async (tenantId: string, status?: string) => {
  const where: Record<string, unknown> = { tenantId };

  if (status) {
    where.status = status as never;
  }

  const orders = await prisma.order.findMany({
    where,
    include: {
      table: { select: { id: true, name: true, floor: true, section: true } },
      user: { select: { id: true, name: true, email: true } },
      items: {
        where: { isVoid: false },
        include: {
          menuItem: { select: { id: true, name: true, price: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return orders;
};

// ---------------------------------------------------------------------------
// getOrderById
// ---------------------------------------------------------------------------
export const getOrderById = async (tenantId: string, id: string) => {
  const order = await prisma.order.findFirst({
    where: { id, tenantId },
    include: {
      table: true,
      user: { select: { id: true, name: true, email: true, userRole: true } },
      items: {
        include: {
          menuItem: true,
          kotItems: {
            include: {
              kot: { select: { id: true, kotNumber: true, status: true } },
            },
          },
        },
      },
      kots: {
        include: {
          items: {
            include: {
              orderItem: {
                include: { menuItem: { select: { id: true, name: true } } },
              },
            },
          },
          user: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: 'asc' },
      },
      payment: true,
    },
  });

  if (!order) {
    throw createError('Order not found', 404);
  }

  return order;
};

// ---------------------------------------------------------------------------
// createOrder
// ---------------------------------------------------------------------------
export const createOrder = async (
  tenantId: string,
  userId: string,
  dto: CreateOrderDto
) => {
  // Validate menu items belong to this tenant and are available
  const menuItemIds = dto.items.map((i) => i.menuItemId);

  const menuItems = await prisma.menuItem.findMany({
    where: { id: { in: menuItemIds }, tenantId, isAvailable: true },
  });

  if (menuItems.length !== menuItemIds.length) {
    throw createError(
      'One or more menu items are invalid or unavailable for this tenant',
      422
    );
  }

  // Validate table if provided
  if (dto.tableId) {
    const table = await prisma.table.findFirst({
      where: { id: dto.tableId, tenantId, isActive: true },
    });
    if (!table) {
      throw createError('Table not found', 404);
    }
  }

  const menuItemMap = new Map(menuItems.map((m) => [m.id, m]));

  const orderNumber = generateOrderNumber('ORD');

  // Build order item data and compute totals
  let subtotal = 0;
  const orderItemsData = dto.items.map((item) => {
    const menuItem = menuItemMap.get(item.menuItemId)!;
    const unitPrice = menuItem.price;
    const totalPrice = unitPrice * item.quantity;
    subtotal += totalPrice;
    return {
      menuItemId: item.menuItemId,
      quantity: item.quantity,
      notes: item.notes,
      unitPrice,
      totalPrice,
    };
  });

  const order = await prisma.order.create({
    data: {
      tenantId,
      userId,
      tableId: dto.tableId,
      orderNumber,
      status: 'PENDING',
      subtotal,
      totalAmount: subtotal,
      notes: dto.notes,
      items: { create: orderItemsData },
    },
    include: {
      table: { select: { id: true, name: true } },
      user: { select: { id: true, name: true } },
      items: {
        include: { menuItem: { select: { id: true, name: true, price: true } } },
      },
    },
  });

  // Mark the table as OCCUPIED
  if (dto.tableId) {
    await prisma.table.update({
      where: { id: dto.tableId },
      data: { status: 'OCCUPIED' },
    });
  }

  return order;
};

// ---------------------------------------------------------------------------
// updateOrderStatus
// ---------------------------------------------------------------------------
export const updateOrderStatus = async (
  tenantId: string,
  id: string,
  dto: UpdateOrderStatusDto
) => {
  const order = await prisma.order.findFirst({ where: { id, tenantId } });

  if (!order) {
    throw createError('Order not found', 404);
  }

  const updatedOrder = await prisma.order.update({
    where: { id },
    data: { status: dto.status },
    include: {
      table: { select: { id: true, name: true, status: true } },
    },
  });

  // Release the table when order is served or completed
  if (
    order.tableId &&
    (dto.status === 'SERVED' || dto.status === 'COMPLETED')
  ) {
    await prisma.table.update({
      where: { id: order.tableId },
      data: { status: 'AVAILABLE' },
    });
  }

  return updatedOrder;
};

// ---------------------------------------------------------------------------
// addItemsToOrder
// ---------------------------------------------------------------------------
export const addItemsToOrder = async (
  tenantId: string,
  id: string,
  dto: AddItemsDto
) => {
  const order = await prisma.order.findFirst({ where: { id, tenantId } });

  if (!order) {
    throw createError('Order not found', 404);
  }

  if (['CANCELLED', 'COMPLETED'].includes(order.status)) {
    throw createError(
      `Cannot add items to an order with status: ${order.status}`,
      422
    );
  }

  // Validate menu items
  const menuItemIds = dto.items.map((i) => i.menuItemId);
  const menuItems = await prisma.menuItem.findMany({
    where: { id: { in: menuItemIds }, tenantId, isAvailable: true },
  });

  if (menuItems.length !== menuItemIds.length) {
    throw createError(
      'One or more menu items are invalid or unavailable for this tenant',
      422
    );
  }

  const menuItemMap = new Map(menuItems.map((m) => [m.id, m]));

  const newItemsData = dto.items.map((item) => {
    const menuItem = menuItemMap.get(item.menuItemId)!;
    return {
      orderId: id,
      menuItemId: item.menuItemId,
      quantity: item.quantity,
      notes: item.notes,
      unitPrice: menuItem.price,
      totalPrice: menuItem.price * item.quantity,
    };
  });

  await prisma.orderItem.createMany({ data: newItemsData });

  // Recalculate totals
  await recalculateOrderTotals(id);

  return prisma.order.findFirst({
    where: { id, tenantId },
    include: {
      items: {
        include: { menuItem: { select: { id: true, name: true, price: true } } },
      },
    },
  });
};

// ---------------------------------------------------------------------------
// voidOrderItem
// ---------------------------------------------------------------------------
export const voidOrderItem = async (
  tenantId: string,
  orderId: string,
  itemId: string
) => {
  // Confirm the order belongs to this tenant
  const order = await prisma.order.findFirst({ where: { id: orderId, tenantId } });

  if (!order) {
    throw createError('Order not found', 404);
  }

  if (['CANCELLED', 'COMPLETED'].includes(order.status)) {
    throw createError(
      `Cannot void items on an order with status: ${order.status}`,
      422
    );
  }

  const orderItem = await prisma.orderItem.findFirst({
    where: { id: itemId, orderId },
  });

  if (!orderItem) {
    throw createError('Order item not found', 404);
  }

  if (orderItem.isVoid) {
    throw createError('Order item is already voided', 422);
  }

  const updated = await prisma.orderItem.update({
    where: { id: itemId },
    data: { isVoid: true },
  });

  // Recalculate totals after voiding
  await recalculateOrderTotals(orderId);

  return updated;
};

// ---------------------------------------------------------------------------
// cancelOrder
// ---------------------------------------------------------------------------
export const cancelOrder = async (tenantId: string, id: string) => {
  const order = await prisma.order.findFirst({ where: { id, tenantId } });

  if (!order) {
    throw createError('Order not found', 404);
  }

  if (order.status === 'CANCELLED') {
    throw createError('Order is already cancelled', 422);
  }

  if (order.status === 'COMPLETED') {
    throw createError('Cannot cancel a completed order', 422);
  }

  const cancelled = await prisma.order.update({
    where: { id },
    data: { status: 'CANCELLED' },
  });

  // Release the table
  if (order.tableId) {
    await prisma.table.update({
      where: { id: order.tableId },
      data: { status: 'AVAILABLE' },
    });
  }

  return cancelled;
};
