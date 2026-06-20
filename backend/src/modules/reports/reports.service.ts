import prisma from '../../config/database';
import { ReportQueryDto } from './reports.dto';
import { createError } from '../../middleware/error.middleware';

export const getDailySalesReport = async (tenantId: string, startDateStr?: string, endDateStr?: string) => {
  const start = startDateStr ? new Date(startDateStr) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const end = endDateStr ? new Date(endDateStr) : new Date();
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);

  const orders = await prisma.order.findMany({
    where: {
      tenantId,
      status: 'COMPLETED',
      createdAt: { gte: start, lte: end },
    },
    select: {
      totalAmount: true,
      createdAt: true,
    },
  });

  const dailyGroups: Record<string, { totalOrders: number; revenue: number }> = {};

  orders.forEach((order) => {
    const day = order.createdAt.toISOString().split('T')[0];
    if (!dailyGroups[day]) {
      dailyGroups[day] = { totalOrders: 0, revenue: 0 };
    }
    dailyGroups[day].totalOrders += 1;
    dailyGroups[day].revenue += order.totalAmount;
  });

  const data = Object.keys(dailyGroups).map((date) => {
    const group = dailyGroups[date];
    return {
      date,
      totalOrders: group.totalOrders,
      revenue: group.revenue,
      avgOrderValue: group.totalOrders > 0 ? Number((group.revenue / group.totalOrders).toFixed(2)) : 0,
    };
  }).sort((a, b) => a.date.localeCompare(b.date));

  return data;
};

export const getOccupancyReport = async (tenantId: string, startDateStr?: string, endDateStr?: string) => {
  const start = startDateStr ? new Date(startDateStr) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const end = endDateStr ? new Date(endDateStr) : new Date();
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);

  const totalRooms = await prisma.room.count({
    where: { tenantId, isActive: true },
  });

  const reservations = await prisma.reservation.findMany({
    where: {
      tenantId,
      status: { in: ['CHECKED_IN', 'CHECKED_OUT'] },
      checkInDate: { lte: end },
      checkOutDate: { gte: start },
    },
    select: {
      checkInDate: true,
      checkOutDate: true,
      roomCharges: true,
    },
  });

  const daysInRange = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
  const totalRoomNightsAvailable = totalRooms * daysInRange;

  let occupiedNights = 0;
  let revenue = 0;

  reservations.forEach((res) => {
    const resStart = new Date(Math.max(start.getTime(), res.checkInDate.getTime()));
    const resEnd = new Date(Math.min(end.getTime(), res.checkOutDate.getTime()));
    const nights = Math.max(0, Math.ceil((resEnd.getTime() - resStart.getTime()) / (1000 * 60 * 60 * 24)));
    occupiedNights += nights;
    revenue += res.roomCharges;
  });

  const occupancyRate = totalRoomNightsAvailable > 0 
    ? Number(((occupiedNights / totalRoomNightsAvailable) * 100).toFixed(2))
    : 0;

  return {
    totalRooms,
    occupiedNights,
    daysInRange,
    totalRoomNightsAvailable,
    occupancyRate,
    revenue,
  };
};

export const getInventoryReport = async (tenantId: string) => {
  const items = await prisma.inventoryItem.findMany({
    where: { tenantId, isActive: true },
  });

  const totalItems = items.length;
  let totalValue = 0;
  let lowStockCount = 0;

  items.forEach((item) => {
    totalValue += item.quantity * item.costPrice;
    if (item.quantity <= item.minimumStock) {
      lowStockCount += 1;
    }
  });

  return {
    totalItems,
    totalValue,
    lowStockCount,
    items: items.map((item) => ({
      id: item.id,
      name: item.name,
      sku: item.sku,
      unit: item.unit,
      quantity: item.quantity,
      minimumStock: item.minimumStock,
      costPrice: item.costPrice,
      totalCost: item.quantity * item.costPrice,
      isLowStock: item.quantity <= item.minimumStock,
    })),
  };
};

export const getRevenueReport = async (tenantId: string, startDateStr?: string, endDateStr?: string) => {
  const start = startDateStr ? new Date(startDateStr) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const end = endDateStr ? new Date(endDateStr) : new Date();
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);

  // Payments categorized
  const payments = await prisma.payment.findMany({
    where: {
      tenantId,
      paidAt: { gte: start, lte: end },
      status: 'PAID',
    },
  });

  let restaurantRevenue = 0;
  let lodgingRevenue = 0;
  let otherRevenue = 0;

  payments.forEach((payment) => {
    if (payment.orderId) {
      restaurantRevenue += payment.amount;
    } else if (payment.reservationId) {
      lodgingRevenue += payment.amount;
    } else {
      otherRevenue += payment.amount;
    }
  });

  const totalRevenue = restaurantRevenue + lodgingRevenue + otherRevenue;

  return {
    restaurantRevenue,
    lodgingRevenue,
    otherRevenue,
    totalRevenue,
  };
};

export const generateReport = async (tenantId: string, dto: ReportQueryDto) => {
  const { type, startDate, endDate } = dto;
  let reportData: any;

  if (type === 'DAILY_SALES') {
    reportData = await getDailySalesReport(tenantId, startDate, endDate);
  } else if (type === 'OCCUPANCY') {
    reportData = await getOccupancyReport(tenantId, startDate, endDate);
  } else if (type === 'INVENTORY') {
    reportData = await getInventoryReport(tenantId);
  } else if (type === 'REVENUE') {
    reportData = await getRevenueReport(tenantId, startDate, endDate);
  } else {
    throw createError('Invalid report type', 400);
  }

  // Auto save report history in database
  const savedReport = await prisma.report.create({
    data: {
      tenantId,
      type,
      data: reportData,
      period: startDate && endDate ? `${startDate} to ${endDate}` : 'Overall/Current',
    },
  });

  return savedReport;
};

export const getSavedReports = async (tenantId: string) => {
  return prisma.report.findMany({
    where: { tenantId },
    orderBy: { generatedAt: 'desc' },
  });
};
