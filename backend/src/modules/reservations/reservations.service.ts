import prisma from '../../config/database';
import { createError } from '../../middleware/error.middleware';
import { generateBookingRef } from '../../shared/helpers';
import { CreateReservationDto, UpdateReservationDto } from './reservations.dto';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const reservationIncludes = {
  guest: {
    select: {
      id: true,
      name: true,
      phone: true,
      email: true,
      nationality: true,
    },
  },
  room: {
    include: {
      roomType: { select: { id: true, name: true } },
    },
  },
  payment: {
    select: {
      id: true,
      amount: true,
      method: true,
      status: true,
      paidAt: true,
    },
  },
} as const;

// ─── Service Functions ────────────────────────────────────────────────────────

export const getReservations = async (tenantId: string, status?: string) => {
  const reservations = await prisma.reservation.findMany({
    where: {
      tenantId,
      ...(status && { status: status as any }),
    },
    include: reservationIncludes,
    orderBy: { createdAt: 'desc' },
  });

  return reservations;
};

export const getReservationById = async (tenantId: string, id: string) => {
  const reservation = await prisma.reservation.findFirst({
    where: { id, tenantId },
    include: {
      guest: true,
      room: {
        include: {
          roomType: true,
        },
      },
      payment: true,
      checkedInBy: { select: { id: true, name: true } },
      checkedOutBy: { select: { id: true, name: true } },
      orders: {
        select: {
          id: true,
          orderNumber: true,
          status: true,
          totalAmount: true,
          createdAt: true,
        },
      },
    },
  });

  if (!reservation) throw createError('Reservation not found', 404);
  return reservation;
};

export const createReservation = async (tenantId: string, dto: CreateReservationDto) => {
  // 1. Validate room belongs to tenant
  const room = await prisma.room.findFirst({
    where: { id: dto.roomId, tenantId, isActive: true },
  });
  if (!room) throw createError('Room not found or inactive', 404);

  // 2. Validate guest belongs to tenant
  const guest = await prisma.guest.findFirst({
    where: { id: dto.guestId, tenantId },
  });
  if (!guest) throw createError('Guest not found', 404);

  // 3. Check for overlapping reservations (room must not be booked for the same dates)
  const overlap = await prisma.reservation.findFirst({
    where: {
      tenantId,
      roomId: dto.roomId,
      status: { in: ['PENDING', 'CONFIRMED', 'CHECKED_IN'] },
      AND: [
        { checkInDate: { lt: dto.checkOutDate } },
        { checkOutDate: { gt: dto.checkInDate } },
      ],
    },
  });
  if (overlap) {
    throw createError(
      `Room is already booked from ${overlap.checkInDate.toDateString()} to ${overlap.checkOutDate.toDateString()}`,
      409
    );
  }

  // 4. Create the reservation
  const bookingRef = generateBookingRef();

  const reservation = await prisma.reservation.create({
    data: {
      tenantId,
      roomId: dto.roomId,
      guestId: dto.guestId,
      bookingRef,
      checkInDate: dto.checkInDate,
      checkOutDate: dto.checkOutDate,
      adults: dto.adults,
      children: dto.children,
      ratePerNight: dto.ratePerNight,
      totalNights: dto.totalNights,
      roomCharges: dto.roomCharges,
      extraCharges: dto.extraCharges ?? 0,
      discount: dto.discount ?? 0,
      totalAmount: dto.totalAmount,
      specialRequest: dto.specialRequest,
      notes: dto.notes,
      source: dto.source,
      status: 'PENDING',
    },
    include: reservationIncludes,
  });

  // 5. Mark room as RESERVED
  await prisma.room.update({
    where: { id: dto.roomId },
    data: { status: 'RESERVED' },
  });

  return reservation;
};

export const updateReservation = async (
  tenantId: string,
  id: string,
  dto: UpdateReservationDto
) => {
  const reservation = await prisma.reservation.findFirst({ where: { id, tenantId } });
  if (!reservation) throw createError('Reservation not found', 404);

  if (['CANCELLED', 'CHECKED_OUT'].includes(reservation.status)) {
    throw createError(`Cannot update a ${reservation.status.toLowerCase()} reservation`, 400);
  }

  // Recalculate totalAmount if financial fields change
  const extraCharges = dto.extraCharges ?? reservation.extraCharges;
  const discount = dto.discount ?? reservation.discount;
  const totalAmount = Math.max(0, reservation.roomCharges + extraCharges - discount);

  const updated = await prisma.reservation.update({
    where: { id },
    data: {
      ...(dto.specialRequest !== undefined && { specialRequest: dto.specialRequest }),
      ...(dto.notes !== undefined && { notes: dto.notes }),
      ...(dto.adults !== undefined && { adults: dto.adults }),
      ...(dto.children !== undefined && { children: dto.children }),
      ...(dto.extraCharges !== undefined && { extraCharges: dto.extraCharges }),
      ...(dto.discount !== undefined && { discount: dto.discount }),
      totalAmount,
    },
    include: reservationIncludes,
  });

  return updated;
};

export const updateStatus = async (tenantId: string, id: string, status: string) => {
  const reservation = await prisma.reservation.findFirst({
    where: { id, tenantId },
    include: { room: true },
  });
  if (!reservation) throw createError('Reservation not found', 404);

  // Determine new room status based on reservation status transition
  const roomStatusMap: Record<string, string> = {
    PENDING: 'RESERVED',
    CONFIRMED: 'RESERVED',
    CHECKED_IN: 'OCCUPIED',
    CHECKED_OUT: 'CHECKOUT_PENDING',
    CANCELLED: 'AVAILABLE',
    NO_SHOW: 'AVAILABLE',
  };

  const newRoomStatus = roomStatusMap[status];

  // Timestamps for actual check-in / check-out
  const now = new Date();
  const timestamps: Record<string, any> = {};
  if (status === 'CHECKED_IN' && !reservation.actualCheckIn) {
    timestamps.actualCheckIn = now;
  }
  if (status === 'CHECKED_OUT' && !reservation.actualCheckOut) {
    timestamps.actualCheckOut = now;
  }

  const [updatedReservation] = await prisma.$transaction([
    prisma.reservation.update({
      where: { id },
      data: { status: status as any, ...timestamps },
      include: reservationIncludes,
    }),
    prisma.room.update({
      where: { id: reservation.roomId },
      data: { status: newRoomStatus as any },
    }),
  ]);

  // Update guest totalStays when checked out
  if (status === 'CHECKED_OUT') {
    await prisma.guest.update({
      where: { id: reservation.guestId },
      data: {
        totalStays: { increment: 1 },
        totalSpent: { increment: reservation.totalAmount },
      },
    });
  }

  return updatedReservation;
};

export const cancelReservation = async (tenantId: string, id: string) => {
  const reservation = await prisma.reservation.findFirst({ where: { id, tenantId } });
  if (!reservation) throw createError('Reservation not found', 404);

  if (reservation.status === 'CANCELLED') {
    throw createError('Reservation is already cancelled', 400);
  }
  if (reservation.status === 'CHECKED_IN') {
    throw createError('Cannot cancel a reservation that is already checked in. Use checkout instead.', 400);
  }
  if (reservation.status === 'CHECKED_OUT') {
    throw createError('Cannot cancel a completed reservation', 400);
  }

  const [cancelled] = await prisma.$transaction([
    prisma.reservation.update({
      where: { id },
      data: { status: 'CANCELLED' },
      include: reservationIncludes,
    }),
    prisma.room.update({
      where: { id: reservation.roomId },
      data: { status: 'AVAILABLE' },
    }),
  ]);

  return cancelled;
};
