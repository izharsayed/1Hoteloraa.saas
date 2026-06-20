import prisma from '../../config/database';
import { CreatePaymentDto } from './payments.dto';
import { createError } from '../../middleware/error.middleware';

export const getPayments = async (tenantId: string, status?: string) => {
  return prisma.payment.findMany({
    where: {
      tenantId,
      ...(status ? { status: status as any } : {}),
    },
    include: {
      order: true,
      reservation: {
        include: {
          guest: true,
        },
      },
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

export const getPaymentById = async (tenantId: string, id: string) => {
  const payment = await prisma.payment.findFirst({
    where: { id, tenantId },
    include: {
      order: true,
      reservation: {
        include: {
          guest: true,
        },
      },
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!payment) throw createError('Payment record not found', 404);
  return payment;
};

export const createPayment = async (tenantId: string, userId: string, dto: CreatePaymentDto) => {
  const isCredit = dto.method === 'CREDIT';
  
  return prisma.payment.create({
    data: {
      tenantId,
      userId,
      orderId: dto.orderId || undefined,
      reservationId: dto.reservationId || undefined,
      amount: dto.amount,
      method: dto.method,
      status: isCredit ? 'PENDING' : 'PAID',
      paidAt: isCredit ? null : new Date(),
      reference: dto.reference,
      notes: dto.notes,
    },
  });
};

export const getPaymentSummary = async (tenantId: string, dateStr?: string) => {
  const date = dateStr ? new Date(dateStr) : new Date();
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const payments = await prisma.payment.findMany({
    where: {
      tenantId,
      createdAt: {
        gte: startOfDay,
        lte: endOfDay,
      },
      status: 'PAID',
    },
  });

  const summary = payments.reduce(
    (acc, curr) => {
      acc.total += curr.amount;
      acc.byMethod[curr.method] = (acc.byMethod[curr.method] || 0) + curr.amount;
      return acc;
    },
    { total: 0, byMethod: {} as Record<string, number> }
  );

  return summary;
};
