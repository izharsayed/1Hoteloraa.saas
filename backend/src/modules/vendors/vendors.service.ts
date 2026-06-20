import prisma from '../../config/database';
import { createError } from '../../middleware/error.middleware';
import { CreateVendorDto, UpdateVendorDto } from './vendors.dto';

export const getVendors = async (tenantId: string, search?: string) => {
  const where: Record<string, unknown> = { tenantId, isActive: true };

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { phone: { contains: search, mode: 'insensitive' } },
    ];
  }

  const vendors = await prisma.vendor.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      address: true,
      gstin: true,
      contactName: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
      _count: { select: { purchases: true } },
    },
  });

  return vendors;
};

export const getVendorById = async (tenantId: string, id: string) => {
  const vendor = await prisma.vendor.findFirst({
    where: { id, tenantId, isActive: true },
    include: {
      purchases: {
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          purchaseNumber: true,
          status: true,
          totalAmount: true,
          createdAt: true,
          receivedAt: true,
        },
      },
    },
  });

  if (!vendor) {
    throw createError('Vendor not found', 404);
  }

  return vendor;
};

export const createVendor = async (tenantId: string, dto: CreateVendorDto) => {
  const vendor = await prisma.vendor.create({
    data: { tenantId, ...dto },
  });

  return vendor;
};

export const updateVendor = async (
  tenantId: string,
  id: string,
  dto: UpdateVendorDto
) => {
  const existing = await prisma.vendor.findFirst({
    where: { id, tenantId, isActive: true },
  });

  if (!existing) {
    throw createError('Vendor not found', 404);
  }

  const vendor = await prisma.vendor.update({
    where: { id },
    data: dto,
  });

  return vendor;
};

export const deleteVendor = async (tenantId: string, id: string) => {
  const existing = await prisma.vendor.findFirst({
    where: { id, tenantId, isActive: true },
  });

  if (!existing) {
    throw createError('Vendor not found', 404);
  }

  await prisma.vendor.update({
    where: { id },
    data: { isActive: false },
  });
};
