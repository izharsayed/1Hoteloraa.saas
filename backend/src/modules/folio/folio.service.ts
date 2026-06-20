import prisma from '../../config/database';
import { AddFolioItemDto } from './folio.dto';
import { createError } from '../../middleware/error.middleware';

export const getFolioByPaymentId = async (tenantId: string, paymentId: string) => {
  const payment = await prisma.payment.findFirst({
    where: { id: paymentId, tenantId },
  });
  if (!payment) throw createError('Payment not found', 404);

  return prisma.folioItem.findMany({
    where: { paymentId },
    orderBy: { createdAt: 'asc' },
  });
};

export const getFolioByReservationId = async (tenantId: string, reservationId: string) => {
  const payment = await prisma.payment.findFirst({
    where: { reservationId, tenantId },
  });

  if (!payment) return [];

  return prisma.folioItem.findMany({
    where: { paymentId: payment.id },
    orderBy: { createdAt: 'asc' },
  });
};

export const addFolioItem = async (tenantId: string, dto: AddFolioItemDto) => {
  const payment = await prisma.payment.findFirst({
    where: { id: dto.paymentId, tenantId },
  });
  if (!payment) throw createError('Payment not found', 404);

  return prisma.folioItem.create({
    data: {
      paymentId: dto.paymentId,
      description: dto.description,
      amount: dto.amount,
      type: dto.type,
    },
  });
};

export const getGuestFolio = async (tenantId: string, reservationId: string) => {
  const reservation = await prisma.reservation.findFirst({
    where: { id: reservationId, tenantId },
    include: {
      guest: true,
      room: true,
      payment: true,
    },
  });

  if (!reservation) throw createError('Reservation not found', 404);

  const folioItems = reservation.payment
    ? await prisma.folioItem.findMany({
        where: { paymentId: reservation.payment.id },
        orderBy: { createdAt: 'asc' },
      })
    : [];

  // Structure charges, payments, and balance
  let totalCharges = reservation.totalAmount; // Base room + extra charges
  let totalPayments = 0;

  if (reservation.payment && reservation.payment.status === 'PAID') {
    totalPayments += reservation.payment.amount;
  }

  folioItems.forEach((item) => {
    if (item.type === 'CHARGE') {
      totalCharges += item.amount;
    } else if (item.type === 'PAYMENT') {
      totalPayments += item.amount;
    } else if (item.type === 'DISCOUNT') {
      totalCharges -= item.amount;
    }
  });

  const balance = totalCharges - totalPayments;

  return {
    reservation: {
      id: reservation.id,
      bookingRef: reservation.bookingRef,
      status: reservation.status,
      checkInDate: reservation.checkInDate,
      checkOutDate: reservation.checkOutDate,
      guest: reservation.guest,
      room: reservation.room,
    },
    baseCharges: {
      roomCharges: reservation.roomCharges,
      extraCharges: reservation.extraCharges,
      discount: reservation.discount,
      totalAmount: reservation.totalAmount,
    },
    folioItems,
    summary: {
      totalCharges,
      totalPayments,
      balance,
    },
  };
};
