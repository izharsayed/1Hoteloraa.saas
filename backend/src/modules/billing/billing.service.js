"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }var _database = require('../../config/database'); var _database2 = _interopRequireDefault(_database);
var _errormiddleware = require('../../middleware/error.middleware');



// ---------------------------------------------------------------------------
// Get Bill by Order ID
// ---------------------------------------------------------------------------
 const getBillByOrderId = async (tenantId, orderId) => {
  const order = await _database2.default.order.findFirst({
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

  if (!order) throw _errormiddleware.createError.call(void 0, 'Order not found', 404);

  return order;
}; exports.getBillByOrderId = getBillByOrderId;

// ---------------------------------------------------------------------------
// Generate Bill — calculates totals, creates Payment, closes order + table
// ---------------------------------------------------------------------------
 const generateBill = async (
  tenantId,
  userId,
  dto
) => {
  const order = await _database2.default.order.findFirst({
    where: { id: dto.orderId, tenantId },
    include: {
      items: { where: { isVoid: false } },
      payment: true,
    },
  });

  if (!order) throw _errormiddleware.createError.call(void 0, 'Order not found', 404);
  if (order.status === 'COMPLETED') throw _errormiddleware.createError.call(void 0, 'Order is already completed and billed', 409);
  if (order.payment) throw _errormiddleware.createError.call(void 0, 'A payment already exists for this order', 409);

  // Fetch tenant settings for tax rate
  const settings = await _database2.default.tenantSettings.findUnique({
    where: { tenantId },
    select: { taxRate: true, serviceCharge: true },
  });

  const taxRate = _nullishCoalesce(_optionalChain([settings, 'optionalAccess', _ => _.taxRate]), () => ( 18));
  const serviceChargeRate = _nullishCoalesce(_optionalChain([settings, 'optionalAccess', _2 => _2.serviceCharge]), () => ( 0));
  const discountAmount = _nullishCoalesce(dto.discountAmount, () => ( 0));

  // Re-calculate subtotal from live order items
  const subtotal = order.items.reduce((sum, item) => sum + item.totalPrice, 0);
  const serviceCharge = parseFloat(((subtotal * serviceChargeRate) / 100).toFixed(2));
  const taxableAmount = subtotal + serviceCharge - discountAmount;
  const taxAmount = parseFloat(((taxableAmount * taxRate) / 100).toFixed(2));
  const totalAmount = parseFloat((taxableAmount + taxAmount).toFixed(2));

  // Run in a transaction: create payment, update order & table
  const result = await _database2.default.$transaction(async (tx) => {
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
        method: dto.paymentMethod ,
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
}; exports.generateBill = generateBill;

// ---------------------------------------------------------------------------
// Get Recent Bills (completed orders with payment)
// ---------------------------------------------------------------------------
 const getRecentBills = async (tenantId, limit = 20) => {
  const bills = await _database2.default.order.findMany({
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
}; exports.getRecentBills = getRecentBills;

// ---------------------------------------------------------------------------
// Get Daily Sales total for a given date (defaults to today)
// ---------------------------------------------------------------------------
 const getDailySales = async (tenantId, date) => {
  const targetDate = date ? new Date(date) : new Date();
  const startOfDay = new Date(targetDate);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(targetDate);
  endOfDay.setHours(23, 59, 59, 999);

  const [orders, paymentAggregate] = await Promise.all([
    _database2.default.order.findMany({
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
    _database2.default.payment.aggregate({
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
  const methodBreakdown = {};
  for (const order of orders) {
    if (order.payment) {
      const method = order.payment.method;
      methodBreakdown[method] = (_nullishCoalesce(methodBreakdown[method], () => ( 0))) + order.payment.amount;
    }
  }

  return {
    date: startOfDay.toISOString().split('T')[0],
    totalOrders: orders.length,
    totalRevenue: _nullishCoalesce(paymentAggregate._sum.amount, () => ( 0)),
    methodBreakdown,
    orders,
  };
}; exports.getDailySales = getDailySales;
