import prisma from '../../config/database';
import { createError } from '../../middleware/error.middleware';
import { CreateFloorDto } from './floors.dto';

export const getFloors = async (tenantId: string) => {
  const floors = await prisma.floor.findMany({
    where: { tenantId },
    orderBy: { name: 'asc' },
  });
  
  if (floors.length === 0) {
    const defaults = ['Ground Floor', 'First Floor', 'Second Floor', 'Rooftop'];
    await prisma.floor.createMany({
      data: defaults.map(name => ({ tenantId, name })),
    });
    return await prisma.floor.findMany({
      where: { tenantId },
      orderBy: { name: 'asc' },
    });
  }
  
  return floors;
};

export const createFloor = async (tenantId: string, dto: CreateFloorDto) => {
  const existing = await prisma.floor.findFirst({
    where: { tenantId, name: dto.name },
  });
  if (existing) throw createError(`Floor "${dto.name}" already exists`, 409);

  return await prisma.floor.create({
    data: {
      tenantId,
      name: dto.name,
    },
  });
};

export const deleteFloor = async (tenantId: string, id: string) => {
  const floor = await prisma.floor.findFirst({
    where: { id, tenantId },
  });
  if (!floor) throw createError('Floor not found', 404);

  await prisma.floor.delete({
    where: { id },
  });

  return { message: 'Floor deleted successfully' };
};
