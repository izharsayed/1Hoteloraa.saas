import prisma from '../../config/database';
import { CheckOutDto } from './checkout.dto';
import { createError } from '../../middleware/error.middleware';

export const getPendingCheckOuts = async (tenantId: string) => {
  return prisma.reservation.findMany({
    where: {
      tenantId,
      status: 'CHECKED_IN',
    },
    include: {
      guest: true,
      room: {
        include: {
          roomType: true,
        },
      },
    },
    orderBy: {
      checkOutDate: 'asc',
    },
  });
};

export const getTodayCheckOuts = async (tenantId: string) => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  return prisma.reservation.findMany({
    where: {
      tenantId,
      status: 'CHECKED_OUT',
      actualCheckOut: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
    include: {
      guest: true,
      room: {
        include: {
          roomType: true,
        },
      },
    },
    orderBy: {
      actualCheckOut: 'desc',
    },
  });
};

export const checkOut = async (tenantId: string, userId: string, dto: CheckOutDto) => {
  const { reservationId, extraCharges = 0, discount = 0, paymentMethod, notes } = dto;

  const reservation = await prisma.reservation.findFirst({
    where: {
      id: reservationId,
      tenantId,
    },
    include: {
      room: true,
      guest: true,
    },
  });

  if (!reservation) {
    throw createError('Reservation not found', 404);
  }

  if (reservation.status !== 'CHECKED_IN') {
    throw createError(`Reservation status is ${reservation.status}, cannot check out.`, 400);
  }

  const finalRoomCharges = reservation.roomCharges;
  const finalExtraCharges = reservation.extraCharges + extraCharges;
  const finalDiscount = reservation.discount + discount;
  const finalTotalAmount = finalRoomCharges + finalExtraCharges - finalDiscount;

  // Start Transaction
  return prisma.$transaction(async (tx) => {
    // 1. Update reservation
    const updatedReservation = await tx.reservation.update({
      where: { id: reservationId },
      data: {
        status: 'CHECKED_OUT',
        actualCheckOut: new Date(),
        checkedOutById: userId,
        extraCharges: finalExtraCharges,
        discount: finalDiscount,
        totalAmount: finalTotalAmount,
        notes: notes ? `${reservation.notes || ''}\nCheck-out notes: ${notes}` : reservation.notes,
      },
    });

    // 2. Update room status to CLEANING
    await tx.room.update({
      where: { id: reservation.roomId },
      data: {
        status: 'CLEANING',
      },
    });

    // 3. Create Payment record (marked as PAID)
    const payment = await tx.payment.create({
      data: {
        tenantId,
        reservationId: reservation.id,
        userId,
        amount: finalTotalAmount,
        method: paymentMethod,
        status: 'PAID',
        paidAt: new Date(),
        notes: `Check-out payment for booking ${reservation.bookingRef}`,
      },
    });

    // 4. Update guest lifetime stays & spent
    await tx.guest.update({
      where: { id: reservation.guestId },
      data: {
        totalStays: {
          increment: 1,
        },
        totalSpent: {
          increment: finalTotalAmount,
        },
      },
    });

    return {
      reservation: updatedReservation,
      payment,
    };
  });
};
