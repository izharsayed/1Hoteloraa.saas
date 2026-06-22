import prisma from '../../config/database';
import { createError } from '../../middleware/error.middleware';
import { generateKOTNumber } from '../../shared/helpers';
import { CreateKOTDto, UpdateKOTStatusDto } from './kot.dto';
import * as notificationsService from '../notifications/notifications.service';

// ---------------------------------------------------------------------------
// getKOTs
// ---------------------------------------------------------------------------
export const getKOTs = async (tenantId: string, status?: string) => {
  const where: Record<string, unknown> = { tenantId };

  if (status) {
    where.status = status as never;
  }

  return prisma.kOT.findMany({
    where,
    include: {
      order: {
        select: {
          id: true,
          orderNumber: true,
          status: true,
          table: { select: { id: true, name: true } },
        },
      },
      items: {
        include: {
          orderItem: {
            include: {
              menuItem: { select: { id: true, name: true } },
            },
          },
        },
      },
      user: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
};

// ---------------------------------------------------------------------------
// getKOTById
// ---------------------------------------------------------------------------
export const getKOTById = async (tenantId: string, id: string) => {
  const kot = await prisma.kOT.findFirst({
    where: { id, tenantId },
    include: {
      order: {
        include: {
          table: true,
          user: { select: { id: true, name: true } },
        },
      },
      items: {
        include: {
          orderItem: {
            include: {
              menuItem: true,
            },
          },
        },
      },
      user: { select: { id: true, name: true, userRole: true } },
    },
  });

  if (!kot) {
    throw createError('KOT not found', 404);
  }

  return kot;
};

// ---------------------------------------------------------------------------
// createKOT
// ---------------------------------------------------------------------------
export const createKOT = async (
  tenantId: string,
  userId: string,
  dto: CreateKOTDto
) => {
  // Verify the order belongs to this tenant
  const order = await prisma.order.findFirst({
    where: { id: dto.orderId, tenantId },
  });

  if (!order) {
    throw createError('Order not found', 404);
  }

  if (['CANCELLED', 'COMPLETED'].includes(order.status)) {
    throw createError(
      `Cannot create a KOT for an order with status: ${order.status}`,
      422
    );
  }

  // Validate that all provided order item IDs belong to this order and are not voided
  const orderItems = await prisma.orderItem.findMany({
    where: {
      id: { in: dto.itemIds },
      orderId: dto.orderId,
      isVoid: false,
    },
  });

  if (orderItems.length !== dto.itemIds.length) {
    throw createError(
      'One or more order item IDs are invalid, voided, or do not belong to this order',
      422
    );
  }

  const kotNumber = generateKOTNumber('KOT');

  const kot = await prisma.kOT.create({
    data: {
      tenantId,
      orderId: dto.orderId,
      userId,
      kotNumber,
      status: 'PENDING',
      notes: dto.notes,
      items: {
        create: orderItems.map((oi) => ({
          orderItemId: oi.id,
          quantity: oi.quantity,
          notes: oi.notes,
        })),
      },
    },
    include: {
      order: { select: { id: true, orderNumber: true, status: true } },
      items: {
        include: {
          orderItem: {
            include: { menuItem: { select: { id: true, name: true } } },
          },
        },
      },
      user: { select: { id: true, name: true } },
    },
  });

  // Advance order to CONFIRMED if still PENDING
  if (order.status === 'PENDING') {
    await prisma.order.update({
      where: { id: dto.orderId },
      data: { status: 'CONFIRMED' },
    });
  }

  return kot;
};

// ---------------------------------------------------------------------------
// updateKOTStatus
// ---------------------------------------------------------------------------
export const updateKOTStatus = async (
  tenantId: string,
  id: string,
  dto: UpdateKOTStatusDto
) => {
  const kot = await prisma.kOT.findFirst({
    where: { id, tenantId },
    include: { order: true },
  });

  if (!kot) {
    throw createError('KOT not found', 404);
  }

  const updatedKOT = await prisma.kOT.update({
    where: { id },
    data: { status: dto.status },
    include: {
      order: {
        select: {
          id: true,
          orderNumber: true,
          status: true,
          userId: true,
          table: { select: { name: true } }
        }
      },
      items: {
        include: {
          orderItem: {
            include: { menuItem: { select: { id: true, name: true } } },
          },
        },
      },
    },
  });

  // Trigger notification to waiter who placed the order
  if (updatedKOT.order?.userId) {
    const tableName = updatedKOT.order.table?.name || 'Quick POS';
    if (dto.status === 'IN_PROGRESS') {
      await notificationsService.createNotification(tenantId, {
        userId: updatedKOT.order.userId,
        title: 'Order Preparing',
        message: `KOT ${updatedKOT.kotNumber} for ${tableName} is now being prepared.`,
        type: 'INFO',
      });
    } else if (dto.status === 'READY') {
      await notificationsService.createNotification(tenantId, {
        userId: updatedKOT.order.userId,
        title: 'Order Ready!',
        message: `KOT ${updatedKOT.kotNumber} for ${tableName} is ready to serve!`,
        type: 'SUCCESS',
      });
    }
  }

  // When KOT is READY, push the parent order to READY as well
  // (only if it hasn't already progressed beyond that)
  if (dto.status === 'READY') {
    const orderStatesToAdvance = ['CONFIRMED', 'PREPARING'];
    if (orderStatesToAdvance.includes(kot.order.status)) {
      await prisma.order.update({
        where: { id: kot.orderId },
        data: { status: 'READY' },
      });
    }
  }

  // When KOT moves to IN_PROGRESS, move order to PREPARING if applicable
  if (dto.status === 'IN_PROGRESS' && kot.order.status === 'CONFIRMED') {
    await prisma.order.update({
      where: { id: kot.orderId },
      data: { status: 'PREPARING' },
    });
  }

  return updatedKOT;
};

// ---------------------------------------------------------------------------
// printKOT
// ---------------------------------------------------------------------------
export const printKOT = async (tenantId: string, id: string) => {
  const kot = await prisma.kOT.findFirst({
    where: { id, tenantId },
  });

  if (!kot) {
    throw createError('KOT not found', 404);
  }

  return prisma.kOT.update({
    where: { id },
    data: { printedAt: new Date() },
    include: {
      order: {
        include: {
          table: { select: { id: true, name: true, floor: true } },
          user: { select: { id: true, name: true } },
        },
      },
      items: {
        include: {
          orderItem: {
            include: {
              menuItem: { select: { id: true, name: true, isVeg: true } },
            },
          },
        },
      },
      user: { select: { id: true, name: true } },
    },
  });
};
