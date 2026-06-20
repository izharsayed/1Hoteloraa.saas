import prisma from '../../config/database';

export const getRestaurantDashboard = async (tenantId: string) => {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  // 1. Total Orders count today
  const totalOrders = await prisma.order.count({
    where: {
      tenantId,
      createdAt: { gte: todayStart, lte: todayEnd },
    },
  });

  // 2. Today's Revenue (completed/paid orders)
  const payments = await prisma.payment.findMany({
    where: {
      tenantId,
      paidAt: { gte: todayStart, lte: todayEnd },
      status: 'PAID',
      orderId: { not: null },
    },
  });
  const todayRevenue = payments.reduce((acc, curr) => acc + curr.amount, 0);

  // 3. Pending KOTs count
  const pendingKOTs = await prisma.kOT.count({
    where: {
      tenantId,
      status: 'PENDING',
    },
  });

  // 4. Tables stats
  const occupiedTables = await prisma.table.count({
    where: {
      tenantId,
      status: 'OCCUPIED',
      isActive: true,
    },
  });

  const totalTables = await prisma.table.count({
    where: {
      tenantId,
      isActive: true,
    },
  });

  // 5. Recent Orders (last 10)
  const recentOrders = await prisma.order.findMany({
    where: { tenantId },
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: {
      table: true,
      user: {
        select: { name: true },
      },
    },
  });

  return {
    totalOrders,
    todayRevenue,
    pendingKOTs,
    occupiedTables,
    totalTables,
    recentOrders,
  };
};

export const getLodgingDashboard = async (tenantId: string) => {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  // 1. Rooms stats
  const totalRooms = await prisma.room.count({
    where: { tenantId, isActive: true },
  });

  const occupiedRooms = await prisma.room.count({
    where: { tenantId, status: 'OCCUPIED', isActive: true },
  });

  const availableRooms = await prisma.room.count({
    where: { tenantId, status: 'AVAILABLE', isActive: true },
  });

  // 2. Today's Check-ins count (either scheduled or checked-in)
  const todayCheckIns = await prisma.reservation.count({
    where: {
      tenantId,
      checkInDate: { gte: todayStart, lte: todayEnd },
      status: { in: ['CONFIRMED', 'CHECKED_IN'] },
    },
  });

  // 3. Today's Check-outs count
  const todayCheckOuts = await prisma.reservation.count({
    where: {
      tenantId,
      checkOutDate: { gte: todayStart, lte: todayEnd },
      status: { in: ['CHECKED_IN', 'CHECKED_OUT'] },
    },
  });

  // 4. Lodging Revenue today
  const payments = await prisma.payment.findMany({
    where: {
      tenantId,
      paidAt: { gte: todayStart, lte: todayEnd },
      status: 'PAID',
      reservationId: { not: null },
    },
  });
  const todayRevenue = payments.reduce((acc, curr) => acc + curr.amount, 0);

  // 5. Pending Housekeeping tasks count
  const pendingHousekeeping = await prisma.housekeeping.count({
    where: {
      tenantId,
      status: { in: ['PENDING', 'IN_PROGRESS'] },
    },
  });

  // 6. Recent Reservations
  const recentReservations = await prisma.reservation.findMany({
    where: { tenantId },
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: {
      guest: true,
      room: true,
    },
  });

  return {
    totalRooms,
    occupiedRooms,
    availableRooms,
    todayCheckIns,
    todayCheckOuts,
    todayRevenue,
    pendingHousekeeping,
    recentReservations,
  };
};

export const getHotelDashboard = async (tenantId: string) => {
  const restaurant = await getRestaurantDashboard(tenantId);
  const lodging = await getLodgingDashboard(tenantId);

  return {
    restaurant: {
      totalOrders: restaurant.totalOrders,
      todayRevenue: restaurant.todayRevenue,
      pendingKOTs: restaurant.pendingKOTs,
      occupiedTables: restaurant.occupiedTables,
      totalTables: restaurant.totalTables,
      recentOrders: restaurant.recentOrders,
    },
    lodging: {
      totalRooms: lodging.totalRooms,
      occupiedRooms: lodging.occupiedRooms,
      availableRooms: lodging.availableRooms,
      todayCheckIns: lodging.todayCheckIns,
      todayCheckOuts: lodging.todayCheckOuts,
      todayRevenue: lodging.todayRevenue,
      pendingHousekeeping: lodging.pendingHousekeeping,
      recentReservations: lodging.recentReservations,
    },
    combinedTodayRevenue: restaurant.todayRevenue + lodging.todayRevenue,
  };
};

export const getDashboard = async (tenantId: string, businessType: string) => {
  if (businessType === 'RESTAURANT') {
    return getRestaurantDashboard(tenantId);
  } else if (businessType === 'LODGING') {
    return getLodgingDashboard(tenantId);
  } else {
    return getHotelDashboard(tenantId);
  }
};
