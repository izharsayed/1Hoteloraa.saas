import prisma from '../../config/database';
import { createError } from '../../middleware/error.middleware';
import { CreateRoomTypeDto, UpdateRoomTypeDto } from './room-types.dto';

export const getRoomTypes = async (tenantId: string) => {
  const roomTypes = await prisma.roomType.findMany({
    where: { tenantId, isActive: true },
    include: {
      _count: {
        select: { rooms: { where: { isActive: true } } },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return roomTypes.map((rt) => ({
    ...rt,
    roomCount: rt._count.rooms,
    _count: undefined,
  }));
};

export const getRoomTypeById = async (tenantId: string, id: string) => {
  const roomType = await prisma.roomType.findFirst({
    where: { id, tenantId, isActive: true },
    include: {
      _count: {
        select: { rooms: { where: { isActive: true } } },
      },
    },
  });

  if (!roomType) throw createError('Room type not found', 404);

  return {
    ...roomType,
    roomCount: roomType._count.rooms,
    _count: undefined,
  };
};

export const createRoomType = async (tenantId: string, dto: CreateRoomTypeDto) => {
  const existing = await prisma.roomType.findFirst({
    where: { tenantId, name: dto.name, isActive: true },
  });

  if (existing) throw createError('A room type with this name already exists', 409);

  return prisma.roomType.create({
    data: {
      tenantId,
      name: dto.name,
      description: dto.description,
      basePrice: dto.basePrice,
      maxOccupancy: dto.maxOccupancy,
      amenities: dto.amenities ?? [],
      imageUrl: dto.imageUrl,
    },
  });
};

export const updateRoomType = async (tenantId: string, id: string, dto: UpdateRoomTypeDto) => {
  const roomType = await prisma.roomType.findFirst({
    where: { id, tenantId, isActive: true },
  });

  if (!roomType) throw createError('Room type not found', 404);

  if (dto.name && dto.name !== roomType.name) {
    const duplicate = await prisma.roomType.findFirst({
      where: { tenantId, name: dto.name, isActive: true, id: { not: id } },
    });
    if (duplicate) throw createError('A room type with this name already exists', 409);
  }

  return prisma.roomType.update({
    where: { id },
    data: {
      ...(dto.name !== undefined && { name: dto.name }),
      ...(dto.description !== undefined && { description: dto.description }),
      ...(dto.basePrice !== undefined && { basePrice: dto.basePrice }),
      ...(dto.maxOccupancy !== undefined && { maxOccupancy: dto.maxOccupancy }),
      ...(dto.amenities !== undefined && { amenities: dto.amenities }),
      ...(dto.imageUrl !== undefined && { imageUrl: dto.imageUrl }),
    },
  });
};

export const deleteRoomType = async (tenantId: string, id: string) => {
  const roomType = await prisma.roomType.findFirst({
    where: { id, tenantId, isActive: true },
  });

  if (!roomType) throw createError('Room type not found', 404);

  const roomCount = await prisma.room.count({
    where: { roomTypeId: id, tenantId, isActive: true },
  });

  if (roomCount > 0) {
    throw createError(
      `Cannot delete room type — it has ${roomCount} active room(s) assigned to it. Reassign or deactivate those rooms first.`,
      400
    );
  }

  return prisma.roomType.update({
    where: { id },
    data: { isActive: false },
  });
};
