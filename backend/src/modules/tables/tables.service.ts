import prisma from '../../config/database';
import { createError } from '../../middleware/error.middleware';
import { CreateTableDto, UpdateTableDto } from './tables.dto';
import { TableStatus } from '@prisma/client';

export const getTables = async (tenantId: string) => {
  const tables = await prisma.table.findMany({
    where: { tenantId, isActive: true },
    include: {
      _count: {
        select: { orders: true },
      },
    },
    orderBy: [{ floor: 'asc' }, { name: 'asc' }],
  });
  return tables;
};

export const getTableById = async (tenantId: string, id: string) => {
  const table = await prisma.table.findFirst({
    where: { id, tenantId, isActive: true },
    include: {
      _count: { select: { orders: true } },
    },
  });
  if (!table) throw createError('Table not found', 404);
  return table;
};

export const createTable = async (tenantId: string, dto: CreateTableDto) => {
  const existing = await prisma.table.findFirst({
    where: { tenantId, name: dto.name, isActive: true },
  });
  if (existing) throw createError(`Table with name "${dto.name}" already exists`, 409);

  const table = await prisma.table.create({
    data: {
      tenantId,
      name: dto.name,
      capacity: dto.capacity ?? 4,
      floor: dto.floor,
      section: dto.section,
    },
  });
  return table;
};

export const updateTable = async (tenantId: string, id: string, dto: UpdateTableDto) => {
  const table = await prisma.table.findFirst({ where: { id, tenantId, isActive: true } });
  if (!table) throw createError('Table not found', 404);

  if (dto.name && dto.name !== table.name) {
    const duplicate = await prisma.table.findFirst({
      where: { tenantId, name: dto.name, isActive: true, id: { not: id } },
    });
    if (duplicate) throw createError(`Table with name "${dto.name}" already exists`, 409);
  }

  const updated = await prisma.table.update({
    where: { id },
    data: {
      ...(dto.name !== undefined && { name: dto.name }),
      ...(dto.capacity !== undefined && { capacity: dto.capacity }),
      ...(dto.floor !== undefined && { floor: dto.floor }),
      ...(dto.section !== undefined && { section: dto.section }),
    },
  });
  return updated;
};

export const updateTableStatus = async (tenantId: string, id: string, status: TableStatus) => {
  const table = await prisma.table.findFirst({ where: { id, tenantId, isActive: true } });
  if (!table) throw createError('Table not found', 404);

  const updated = await prisma.table.update({
    where: { id },
    data: { status },
  });
  return updated;
};

export const deleteTable = async (tenantId: string, id: string) => {
  const table = await prisma.table.findFirst({ where: { id, tenantId, isActive: true } });
  if (!table) throw createError('Table not found', 404);

  await prisma.table.update({
    where: { id },
    data: { isActive: false },
  });
  return { message: 'Table deleted successfully' };
};
