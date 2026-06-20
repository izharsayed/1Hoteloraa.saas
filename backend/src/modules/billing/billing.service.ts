import prisma from '../../config/database';
import { createError } from '../../middleware/error.middleware';
import { GenerateBillDto } from './billing.dto';
import { generateOrderNumber } from '../../shared/helpers';

// ---------------------------------------------------------------------------
// Get Bill by Order ID
// ---------------------------------------------------------------------------
export const getBillByOrderId = async (tenantId: string, orderId: string) => {
  const order = await prisma.order.findFirst({
    where: { id: orderId, tenantId },
    include: {
      items: {
        where: { isVoid: false },
        include: {
          menuItem: {
            select: { id: true, name: true, price: true, isVeg: true },
          },
        },
      },
      payment: true,
      table: { select: { id: true, name: true, floor: true, section: true } },
      user: { select: { id: true, name: true } },
    },
  });

  if (!order) throw createError('Order not found', 404);

  return order;
};

// ---------------------------------------------------------------------------
// Generate Bill — calculates totals, creates Payment, closes order + table
// ---------------------------------------------------------------------------
export const generateBill = async (
  tenantId: string,
  userId: string,
  dto: GenerateBillDto
) => {
  const order = await prisma.order.findFirst({
    where: { id: dto.orderId, tenantId },
    include: {
      items: { where: { isVoid: false } },
      payment: true,
    },
  });

  if (!order) throw createError('Order not found', 404);
  if (order.status === 'COMPLETED') throw createError('Order is already completed and billed', 409);
  if (order.payment) throw createError('A payment already exists for this order', 409);

  // Fetch tenant settings for tax rate
  const settings = await prisma.tenantSettings.findUnique({
    where: { tenantId },
    select: { taxRate: true, serviceCharge: true },
  });

  const taxRate = settings?.taxRate ?? 18;
  const serviceChargeRate = settings?.serviceCharge ?? 0;
  const discountAmount = dto.discountAmount ?? 0;

  // Re-calculate subtotal from live order items
  const subtotal = order.items.reduce((sum, item) => sum + item.totalPrice, 0);
  const serviceCharge = parseFloat(((subtotal * serviceChargeRate) / 100).toFixed(2));
  const taxableAmount = subtotal + serviceCharge - discountAmount;
  const taxAmount = parseFloat(((taxableAmount * taxRate) / 100).toFixed(2));
  const totalAmount = parseFloat((taxableAmount + taxAmount).toFixed(2));

  // Run in a transaction: create payment, update order & table
  const result = await prisma.$transaction(async (tx) => {
    // Update order with final figures
    const updatedOrder = await tx.order.update({
      where: { id: dto.orderId },
      data: {
        status: 'COMPLETED',
        subtotal,
        taxAmount,
        discountAmount,
        totalAmount,
      },
    });

    // Create payment record
    const payment = await tx.payment.create({
      data: {
        tenantId,
        orderId: dto.orderId,
        userId,
        amount: totalAmount,
        method: dto.paymentMethod as any,
        status: 'PAID',
        reference: dto.reference,
        notes: dto.notes,
        paidAt: new Date(),
      },
    });

    // Also add a folio entry summarising the bill charge
    await tx.folioItem.create({
      data: {
        paymentId: payment.id,
        description: `Order #${updatedOrder.orderNumber} — Bill Settlement`,
        amount: totalAmount,
        type: 'PAYMENT',
      },
    });

    // Release the table if one was linked
    if (order.tableId) {
      await tx.table.update({
        where: { id: order.tableId },
        data: { status: 'AVAILABLE' },
      });
    }

    return { order: updatedOrder, payment };
  });

  return result;
};

// ---------------------------------------------------------------------------
// Get Recent Bills (completed orders with payment)
// ---------------------------------------------------------------------------
export const getRecentBills = async (tenantId: string, limit = 20) => {
  const bills = await prisma.order.findMany({
    where: { tenantId, status: 'COMPLETED' },
    orderBy: { updatedAt: 'desc' },
    take: limit,
    include: {
      payment: {
        select: {
          id: true,
          amount: true,
          method: true,
          status: true,
          paidAt: true,
          reference: true,
        },
      },
      table: { select: { id: true, name: true } },
      user: { select: { id: true, name: true } },
      _count: { select: { items: true } },
    },
  });

  return bills;
};

// ---------------------------------------------------------------------------
// Get Daily Sales total for a given date (defaults to today)
// ---------------------------------------------------------------------------
export const getDailySales = async (tenantId: string, date?: string) => {
  const targetDate = date ? new Date(date) : new Date();
  const startOfDay = new Date(targetDate);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(targetDate);
  endOfDay.setHours(23, 59, 59, 999);

  const [orders, paymentAggregate] = await Promise.all([
    prisma.order.findMany({
      where: {
        tenantId,
        status: 'COMPLETED',
        updatedAt: { gte: startOfDay, lte: endOfDay },
      },
      select: {
        id: true,
        orderNumber: true,
        subtotal: true,
        taxAmount: true,
        discountAmount: true,
        totalAmount: true,
        updatedAt: true,
        payment: { select: { method: true, amount: true } },
      },
    }),
    prisma.payment.aggregate({
      where: {
        tenantId,
        status: 'PAID',
        paidAt: { gte: startOfDay, lte: endOfDay },
        orderId: { not: null },
      },
      _sum: { amount: true },
      _count: { id: true },
    }),
  ]);

  // Break down by payment method
  const methodBreakdown: Record<string, number> = {};
  for (const order of orders) {
    if (order.payment) {
      const method = order.payment.method;
      methodBreakdown[method] = (methodBreakdown[method] ?? 0) + order.payment.amount;
    }
  }

  return {
    date: startOfDay.toISOString().split('T')[0],
    totalOrders: orders.length,
    totalRevenue: paymentAggregate._sum.amount ?? 0,
    methodBreakdown,
    orders,
  };
};
