import prisma from '../../config/database';
import { UpdateTenantDto } from './tenants.dto';
import { createError } from '../../middleware/error.middleware';

export const getTenantProfile = async (tenantId: string) => {
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    include: {
      subscription: true,
      features: true,
    },
  });

  if (!tenant) throw createError('Tenant not found', 404);
  return tenant;
};

export const updateTenant = async (tenantId: string, dto: UpdateTenantDto) => {
  const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
  if (!tenant) throw createError('Tenant not found', 404);

  return prisma.tenant.update({
    where: { id: tenantId },
    data: dto as any,
    include: {
      subscription: true,
      features: true,
    },
  });
};

export const getTenantFeatures = async (tenantId: string) => {
  return prisma.tenantFeature.findMany({
    where: { tenantId },
  });
};

export const toggleFeature = async (tenantId: string, feature: string) => {
  const existing = await prisma.tenantFeature.findUnique({
    where: {
      tenantId_feature: {
        tenantId,
        feature,
      },
    },
  });

  if (!existing) {
    return prisma.tenantFeature.create({
      data: {
        tenantId,
        feature,
        isEnabled: true,
      },
    });
  }

  return prisma.tenantFeature.update({
    where: {
      tenantId_feature: {
        tenantId,
        feature,
      },
    },
    data: {
      isEnabled: !existing.isEnabled,
    },
  });
};
