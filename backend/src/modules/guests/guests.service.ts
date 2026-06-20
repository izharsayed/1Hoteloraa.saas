import prisma from '../../config/database';
import { createError } from '../../middleware/error.middleware';
import { CreateGuestDto, UpdateGuestDto } from './guests.dto';

export const getGuests = async (tenantId: string, search?: string) => {
  const where = {
    tenantId,
    ...(search && {
      OR: [
        { name: { contains: search, mode: 'insensitive' as const } },
        { phone: { contains: search, mode: 'insensitive' as const } },
        { email: { contains: search, mode: 'insensitive' as const } },
      ],
    }),
  };

  const guests = await prisma.guest.findMany({
    where,
    select: {
      id: true,
      name: true,
      phone: true,
      email: true,
      idType: true,
      city: true,
      country: true,
      nationality: true,
      totalStays: true,
      totalSpent: true,
      createdAt: true,
      _count: {
        select: { reservations: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return guests;
};

export const getGuestById = async (tenantId: string, id: string) => {
  const guest = await prisma.guest.findFirst({
    where: { id, tenantId },
    include: {
      reservations: {
        include: {
          room: { select: { id: true, number: true, floor: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
    },
  });

  if (!guest) throw createError('Guest not found', 404);
  return guest;
};

export const createGuest = async (tenantId: string, dto: CreateGuestDto) => {
  // Check for duplicate phone within tenant
  const existing = await prisma.guest.findFirst({
    where: { tenantId, phone: dto.phone },
  });
  if (existing) throw createError('A guest with this phone number already exists', 409);

  const guest = await prisma.guest.create({
    data: {
      tenantId,
      name: dto.name,
      phone: dto.phone,
      email: dto.email,
      idType: dto.idType as any,
      idNumber: dto.idNumber,
      address: dto.address,
      city: dto.city,
      country: dto.country,
      nationality: dto.nationality,
      dateOfBirth: dto.dateOfBirth,
      notes: dto.notes,
    },
  });

  return guest;
};

export const updateGuest = async (tenantId: string, id: string, dto: UpdateGuestDto) => {
  const guest = await prisma.guest.findFirst({ where: { id, tenantId } });
  if (!guest) throw createError('Guest not found', 404);

  // If phone is being changed, check uniqueness
  if (dto.phone && dto.phone !== guest.phone) {
    const conflict = await prisma.guest.findFirst({
      where: { tenantId, phone: dto.phone, id: { not: id } },
    });
    if (conflict) throw createError('A guest with this phone number already exists', 409);
  }

  const updated = await prisma.guest.update({
    where: { id },
    data: {
      ...(dto.name !== undefined && { name: dto.name }),
      ...(dto.phone !== undefined && { phone: dto.phone }),
      ...(dto.email !== undefined && { email: dto.email }),
      ...(dto.idType !== undefined && { idType: dto.idType as any }),
      ...(dto.idNumber !== undefined && { idNumber: dto.idNumber }),
      ...(dto.address !== undefined && { address: dto.address }),
      ...(dto.city !== undefined && { city: dto.city }),
      ...(dto.country !== undefined && { country: dto.country }),
      ...(dto.nationality !== undefined && { nationality: dto.nationality }),
      ...(dto.dateOfBirth !== undefined && { dateOfBirth: dto.dateOfBirth }),
      ...(dto.notes !== undefined && { notes: dto.notes }),
    },
  });

  return updated;
};

export const getGuestHistory = async (tenantId: string, id: string) => {
  const guest = await prisma.guest.findFirst({ where: { id, tenantId } });
  if (!guest) throw createError('Guest not found', 404);

  const reservations = await prisma.reservation.findMany({
    where: { guestId: id, tenantId },
    include: {
      room: {
        include: {
          roomType: { select: { id: true, name: true, basePrice: true } },
        },
      },
      payment: {
        select: { id: true, amount: true, method: true, status: true, paidAt: true },
      },
      checkedInBy: { select: { id: true, name: true } },
      checkedOutBy: { select: { id: true, name: true } },
    },
    orderBy: { checkInDate: 'desc' },
  });

  return {
    guest: {
      id: guest.id,
      name: guest.name,
      phone: guest.phone,
      email: guest.email,
      totalStays: guest.totalStays,
      totalSpent: guest.totalSpent,
    },
    reservations,
  };
};
