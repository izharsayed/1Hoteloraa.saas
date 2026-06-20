import prisma from '../../config/database';
import { createError } from '../../middleware/error.middleware';
import { CheckInDto } from './checkin.dto';

// ─── helpers ─────────────────────────────────────────────────────────────────

const todayRange = () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  return { start, end };
};

// ─── service functions ────────────────────────────────────────────────────────

/**
 * Returns all CONFIRMED reservations whose checkInDate is on or before today.
 * Includes the associated guest and room data.
 */
export const getPendingCheckIns = async (tenantId: string) => {
  const today = new Date();
  today.setHours(23, 59, 59, 999);

  return prisma.reservation.findMany({
    where: {
      tenantId,
      status: 'CONFIRMED',
      checkInDate: { lte: today },
    },
    include: {
      guest: true,
      room: {
        include: { roomType: true },
      },
    },
    orderBy: { checkInDate: 'asc' },
  });
};

/**
 * Performs the check-in operation for a given reservation:
 *   1. Validates the reservation belongs to the tenant and is CONFIRMED.
 *   2. Updates reservation status → CHECKED_IN, sets actualCheckIn and checkedInById.
 *   3. Updates the room status → OCCUPIED.
 * All three writes are executed in a Prisma transaction.
 */
export const checkIn = async (tenantId: string, userId: string, dto: CheckInDto) => {
  const reservation = await prisma.reservation.findFirst({
    where: { id: dto.reservationId, tenantId },
    include: { room: true },
  });

  if (!reservation) {
    throw createError('Reservation not found', 404);
  }

  if (reservation.status !== 'CONFIRMED') {
    throw createError(
      `Cannot check-in: reservation is currently ${reservation.status}`,
      400,
    );
  }

  const now = new Date();

  const [updatedReservation] = await prisma.$transaction([
    prisma.reservation.update({
      where: { id: reservation.id },
      data: {
        status: 'CHECKED_IN',
        actualCheckIn: now,
        checkedInById: userId,
        ...(dto.notes ? { notes: dto.notes } : {}),
      },
      include: {
        guest: true,
        room: { include: { roomType: true } },
        checkedInBy: { select: { id: true, name: true, email: true } },
      },
    }),
    prisma.room.update({
      where: { id: reservation.roomId },
      data: { status: 'OCCUPIED' },
    }),
  ]);

  return updatedReservation;
};

/**
 * Returns all reservations that were checked in today (actualCheckIn within today's date range).
 */
export const getTodayCheckIns = async (tenantId: string) => {
  const { start, end } = todayRange();

  return prisma.reservation.findMany({
    where: {
      tenantId,
      status: 'CHECKED_IN',
      actualCheckIn: { gte: start, lte: end },
    },
    include: {
      guest: true,
      room: { include: { roomType: true } },
      checkedInBy: { select: { id: true, name: true, email: true } },
    },
    orderBy: { actualCheckIn: 'desc' },
  });
};
