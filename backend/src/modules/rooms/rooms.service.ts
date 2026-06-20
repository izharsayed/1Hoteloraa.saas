import { RoomStatus } from '@prisma/client';
import prisma from '../../config/database';
import { createError } from '../../middleware/error.middleware';
import { CreateRoomDto, UpdateRoomDto } from './rooms.dto';

// ─── List Rooms ───────────────────────────────────────────────────────────────

export const getRooms = async (tenantId: string, status?: string) => {
  const where: Record<string, unknown> = { tenantId, isActive: true };

  if (status) {
    const validStatuses = [
      'AVAILABLE', 'OCCUPIED', 'RESERVED', 'MAINTENANCE', 'CHECKOUT_PENDING', 'CLEANING',
    ];
    if (!validStatuses.includes(status.toUpperCase())) {
      throw createError(`Invalid status value: ${status}`, 400);
    }
    where.status = status.toUpperCase() as RoomStatus;
  }

  return prisma.room.findMany({
    where,
    include: {
      roomType: {
        select: {
          id: true,
          name: true,
          basePrice: true,
          maxOccupancy: true,
          amenities: true,
          imageUrl: true,
        },
      },
    },
    orderBy: [{ floor: 'asc' }, { number: 'asc' }],
  });
};

// ─── Get Room By ID ───────────────────────────────────────────────────────────

export const getRoomById = async (tenantId: string, id: string) => {
  const room = await prisma.room.findFirst({
    where: { id, tenantId, isActive: true },
    include: {
      roomType: true,
      reservations: {
        where: {
          status: { in: ['CONFIRMED', 'CHECKED_IN'] },
        },
        include: {
          guest: {
            select: { id: true, name: true, phone: true, email: true },
          },
        },
        orderBy: { checkInDate: 'asc' },
        take: 1,
      },
    },
  });

  if (!room) throw createError('Room not found', 404);

  return {
    ...room,
    currentReservation: room.reservations[0] ?? null,
    reservations: undefined,
  };
};

// ─── Create Room ──────────────────────────────────────────────────────────────

export const createRoom = async (tenantId: string, dto: CreateRoomDto) => {
  // Verify the room type belongs to this tenant
  const roomType = await prisma.roomType.findFirst({
    where: { id: dto.roomTypeId, tenantId, isActive: true },
  });
  if (!roomType) throw createError('Room type not found', 404);

  // Enforce unique room number within the tenant
  const duplicate = await prisma.room.findUnique({
    where: { tenantId_number: { tenantId, number: dto.number } },
  });
  if (duplicate) throw createError(`Room number "${dto.number}" already exists in this property`, 409);

  return prisma.room.create({
    data: {
      tenantId,
      roomTypeId: dto.roomTypeId,
      number: dto.number,
      floor: dto.floor,
      description: dto.description,
    },
    include: {
      roomType: {
        select: {
          id: true,
          name: true,
          basePrice: true,
          maxOccupancy: true,
          amenities: true,
        },
      },
    },
  });
};

// ─── Update Room ──────────────────────────────────────────────────────────────

export const updateRoom = async (tenantId: string, id: string, dto: UpdateRoomDto) => {
  const room = await prisma.room.findFirst({
    where: { id, tenantId, isActive: true },
  });
  if (!room) throw createError('Room not found', 404);

  // Check for duplicate number if number is being changed
  if (dto.number && dto.number !== room.number) {
    const duplicate = await prisma.room.findUnique({
      where: { tenantId_number: { tenantId, number: dto.number } },
    });
    if (duplicate) throw createError(`Room number "${dto.number}" already exists in this property`, 409);
  }

  return prisma.room.update({
    where: { id },
    data: {
      ...(dto.number !== undefined && { number: dto.number }),
      ...(dto.floor !== undefined && { floor: dto.floor }),
      ...(dto.description !== undefined && { description: dto.description }),
    },
    include: {
      roomType: {
        select: { id: true, name: true, basePrice: true, maxOccupancy: true },
      },
    },
  });
};

// ─── Update Room Status ───────────────────────────────────────────────────────

export const updateRoomStatus = async (tenantId: string, id: string, status: RoomStatus) => {
  const room = await prisma.room.findFirst({
    where: { id, tenantId, isActive: true },
  });
  if (!room) throw createError('Room not found', 404);

  return prisma.room.update({
    where: { id },
    data: { status },
    select: {
      id: true,
      number: true,
      floor: true,
      status: true,
      updatedAt: true,
    },
  });
};

// ─── Soft Delete Room ─────────────────────────────────────────────────────────

export const deleteRoom = async (tenantId: string, id: string) => {
  const room = await prisma.room.findFirst({
    where: { id, tenantId, isActive: true },
  });
  if (!room) throw createError('Room not found', 404);

  // Prevent deletion if there is an active reservation
  const activeReservation = await prisma.reservation.findFirst({
    where: {
      roomId: id,
      tenantId,
      status: { in: ['CONFIRMED', 'CHECKED_IN'] },
    },
  });

  if (activeReservation) {
    throw createError(
      'Cannot delete room — it has an active or upcoming reservation. Cancel or check-out first.',
      400
    );
  }

  return prisma.room.update({
    where: { id },
    data: { isActive: false },
    select: { id: true, number: true, isActive: true },
  });
};

// ─── Get Available Rooms ──────────────────────────────────────────────────────

export const getAvailableRooms = async (
  tenantId: string,
  checkIn: Date,
  checkOut: Date
) => {
  if (checkOut <= checkIn) {
    throw createError('Check-out date must be after check-in date', 400);
  }

  // Find rooms that have NO overlapping confirmed/checked_in reservations
  const bookedRoomIds = await prisma.reservation.findMany({
    where: {
      tenantId,
      status: { in: ['CONFIRMED', 'CHECKED_IN'] },
      AND: [
        { checkInDate: { lt: checkOut } },
        { checkOutDate: { gt: checkIn } },
      ],
    },
    select: { roomId: true },
  });

  const bookedIds = bookedRoomIds.map((r) => r.roomId);

  return prisma.room.findMany({
    where: {
      tenantId,
      isActive: true,
      status: { in: ['AVAILABLE', 'CLEANING'] },
      id: { notIn: bookedIds },
    },
    include: {
      roomType: {
        select: {
          id: true,
          name: true,
          basePrice: true,
          maxOccupancy: true,
          amenities: true,
          imageUrl: true,
        },
      },
    },
    orderBy: [{ floor: 'asc' }, { number: 'asc' }],
  });
};
