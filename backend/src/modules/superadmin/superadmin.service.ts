import prisma from '../../config/database';
import bcrypt from 'bcryptjs';
import { createError } from '../../middleware/error.middleware';

const SALT_ROUNDS = 12;

// ─── OVERVIEW METRICS ──────────────────────────────────────────
export const getOverviewMetrics = async () => {
  const tenants = await prisma.tenant.findMany({
    include: { subscription: true }
  });

  const totalTenants = tenants.length;
  const activeSubscribers = tenants.filter(t => t.isActive && t.subscription?.status === 'ACTIVE').length;
  const trialCustomers = tenants.filter(t => t.subscription?.status === 'TRIAL').length;
  
  // Calculate MRR
  let mrr = 0;
  tenants.forEach(t => {
    if (t.isActive && t.subscription?.status === 'ACTIVE') {
      mrr += t.subscription.amount;
    }
  });

  const arr = mrr * 12;

  // Mock CPU, RAM, Cache Stats for SaaS monitor
  const systemStats = {
    cpuLoad: Math.floor(Math.random() * 15) + 5, // 5% - 20%
    ramUsage: (Math.random() * 0.8 + 2.8).toFixed(1), // 2.8GB - 3.6GB
    dbCacheHit: Math.floor(Math.random() * 5) + 63 // 63% - 68%
  };

  return {
    totalTenants,
    activeSubscribers,
    trialCustomers,
    churnRate: '1.2%',
    averageRevenuePerTenant: totalTenants > 0 ? `₹${Math.round(mrr / totalTenants).toLocaleString('en-IN')}` : '₹0',
    mrr: `₹${mrr.toLocaleString('en-IN')}`,
    arr: arr >= 10000000 ? `₹${(arr / 10000000).toFixed(2)} Cr` : `₹${arr.toLocaleString('en-IN')}`,
    pendingRenewals: Math.floor(Math.random() * 5) + 2,
    systemStats
  };
};

// ─── TENANTS REGISTRY ─────────────────────────────────────────
export const getAllTenants = async () => {
  const tenants = await prisma.tenant.findMany({
    include: {
      subscription: true,
      features: true,
      users: {
        where: { userRole: 'TENANT_ADMIN' },
        select: { email: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return tenants.map(t => ({
    id: t.id,
    name: t.name,
    slug: t.slug,
    businessType: t.businessType,
    plan: t.subscription?.plan || 'STARTER',
    status: t.isActive ? (t.subscription?.status === 'TRIAL' ? 'TRIAL' : 'ACTIVE') : 'SUSPENDED',
    adminEmail: t.users[0]?.email || 'no-admin@hoteloraa.com',
    dateJoined: t.createdAt.toISOString().split('T')[0],
    features: {
      POS: t.features.find(f => f.feature === 'POS')?.isEnabled || false,
      ROOMS: t.features.find(f => f.feature === 'ROOMS')?.isEnabled || false,
      HOUSEKEEPING: t.features.find(f => f.feature === 'HOUSEKEEPING')?.isEnabled || false
    }
  }));
};

export const createTenant = async (dto: any) => {
  const existing = await prisma.tenant.findUnique({ where: { slug: dto.slug } });
  if (existing) throw createError('Tenant slug already exists on cluster', 400);

  const password = Math.random().toString(36).slice(-8);
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  // Default features based on business type
  const defaultFeaturesMap: Record<string, string[]> = {
    RESTAURANT: ['POS'],
    LODGING: ['ROOMS', 'HOUSEKEEPING'],
    HOTEL_RESTAURANT: ['POS', 'ROOMS', 'HOUSEKEEPING']
  };

  const featureKeys = defaultFeaturesMap[dto.businessType] || [];
  const allPossibleFeatures = ['POS', 'ROOMS', 'HOUSEKEEPING'];

  const mrrMap: Record<string, number> = {
    FREE: 0,
    STARTER: 4999,
    PROFESSIONAL: 9999,
    ENTERPRISE: 14999
  };

  const planAmount = mrrMap[dto.plan] || 0;

  const tenant = await prisma.tenant.create({
    data: {
      name: dto.name,
      slug: dto.slug,
      businessType: dto.businessType,
      isActive: true,
      subscription: {
        create: {
          plan: dto.plan,
          status: dto.plan === 'FREE' ? 'TRIAL' : 'ACTIVE',
          amount: planAmount,
          trialEnds: dto.plan === 'FREE' ? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) : null
        }
      },
      features: {
        create: allPossibleFeatures.map(f => ({
          feature: f,
          isEnabled: featureKeys.includes(f)
        }))
      },
      users: {
        create: {
          name: `${dto.name} Admin`,
          email: dto.adminEmail,
          passwordHash,
          userRole: 'TENANT_ADMIN',
          isActive: true
        }
      },
      settings: {
        create: {}
      }
    }
  });

  // Log to Audit Log
  await prisma.auditLog.create({
    data: {
      action: 'TENANT_CREATED',
      actor: 'SuperAdmin',
      entity: dto.name,
      previousValue: 'None',
      newValue: `Type: ${dto.businessType} | Plan: ${dto.plan} | Admin: ${dto.adminEmail}`
    }
  });

  return {
    tenant,
    generatedPassword: password
  };
};

export const toggleTenantStatus = async (id: string) => {
  const tenant = await prisma.tenant.findUnique({ where: { id } });
  if (!tenant) throw createError('Tenant not found', 404);

  const updated = await prisma.tenant.update({
    where: { id },
    data: { isActive: !tenant.isActive }
  });

  await prisma.auditLog.create({
    data: {
      action: updated.isActive ? 'TENANT_ACTIVATED' : 'TENANT_SUSPENDED',
      actor: 'SuperAdmin',
      entity: tenant.name,
      previousValue: `Status: ${tenant.isActive ? 'ACTIVE' : 'SUSPENDED'}`,
      newValue: `Status: ${updated.isActive ? 'ACTIVE' : 'SUSPENDED'}`
    }
  });

  return updated;
};

export const configureTenantFeatures = async (id: string, dto: any) => {
  const tenant = await prisma.tenant.findUnique({ where: { id }, include: { features: true } });
  if (!tenant) throw createError('Tenant not found', 404);

  // Update businessType
  await prisma.tenant.update({
    where: { id },
    data: { businessType: dto.businessType }
  });

  // Update features
  const featuresList = dto.features; // e.g. { POS: true, ROOMS: false }
  for (const [featName, isEnabled] of Object.entries(featuresList)) {
    await prisma.tenantFeature.upsert({
      where: { tenantId_feature: { tenantId: id, feature: featName } },
      create: { tenantId: id, feature: featName, isEnabled: isEnabled as boolean },
      update: { isEnabled: isEnabled as boolean }
    });
  }

  await prisma.auditLog.create({
    data: {
      action: 'FEATURE_CONFIGURATION_CHANGED',
      actor: 'SuperAdmin',
      entity: tenant.name,
      previousValue: JSON.stringify(tenant.features.map(f => `${f.feature}:${f.isEnabled}`)),
      newValue: `Type: ${dto.businessType} | Features: ${JSON.stringify(featuresList)}`
    }
  });

  return { success: true };
};

export const configureTenantPlan = async (id: string, dto: any) => {
  const tenant = await prisma.tenant.findUnique({ where: { id }, include: { subscription: true } });
  if (!tenant) throw createError('Tenant not found', 404);

  const mrrMap: Record<string, number> = {
    FREE: 0,
    STARTER: 4999,
    PROFESSIONAL: 9999,
    ENTERPRISE: 14999
  };

  const planAmount = mrrMap[dto.plan] || 0;

  const updatedSubscription = await prisma.subscription.update({
    where: { tenantId: id },
    data: {
      plan: dto.plan,
      amount: planAmount,
      status: dto.plan === 'FREE' ? 'TRIAL' : 'ACTIVE'
    }
  });

  await prisma.auditLog.create({
    data: {
      action: 'SUBSCRIPTION_UPGRADED',
      actor: 'SuperAdmin',
      entity: tenant.name,
      previousValue: `Plan: ${tenant.subscription?.plan}`,
      newValue: `Plan: ${dto.plan}`
    }
  });

  return updatedSubscription;
};

export const deleteTenant = async (id: string) => {
  const tenant = await prisma.tenant.findUnique({ where: { id } });
  if (!tenant) throw createError('Tenant not found', 404);

  await prisma.tenant.delete({ where: { id } });

  await prisma.auditLog.create({
    data: {
      action: 'TENANT_DELETED',
      actor: 'SuperAdmin',
      entity: tenant.name,
      previousValue: `Slug: ${tenant.slug}`,
      newValue: 'DELETED'
    }
  });

  return { success: true };
};

// ─── SUBSCRIPTION PLANS ────────────────────────────────────────
export const getSubscriptionPlans = async () => {
  // Return preconfigured SaaS pricing plans mapped with statistics
  const tenants = await prisma.tenant.findMany({ include: { subscription: true } });
  
  const getCount = (plan: string) => tenants.filter(t => t.subscription?.plan === plan).length;

  return [
    { id: 1, name: 'Free Trial', monthlyPrice: 0, yearlyPrice: 0, userLimit: 3, storageLimit: 1, status: 'ACTIVE', features: ['pos', 'rooms'], activeTenantsCount: getCount('FREE') },
    { id: 2, name: 'Starter Plan', monthlyPrice: 4999, yearlyPrice: 49990, userLimit: 10, storageLimit: 5, status: 'ACTIVE', features: ['pos', 'rooms', 'kot'], activeTenantsCount: getCount('STARTER') },
    { id: 3, name: 'Professional Plan', monthlyPrice: 9999, yearlyPrice: 99990, userLimit: 30, storageLimit: 20, status: 'ACTIVE', features: ['pos', 'rooms', 'kot', 'housekeeping', 'inventory'], activeTenantsCount: getCount('PROFESSIONAL') },
    { id: 4, name: 'Enterprise Suite', monthlyPrice: 14999, yearlyPrice: 149990, userLimit: 100, storageLimit: 100, status: 'ACTIVE', features: ['pos', 'rooms', 'kot', 'housekeeping', 'inventory', 'reports', 'room_service', 'guest_folio'], activeTenantsCount: getCount('ENTERPRISE') },
  ];
};

// ─── USERS DIRECTORY ──────────────────────────────────────────
export const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    include: { tenant: true, role: true },
    orderBy: { createdAt: 'desc' }
  });

  return users.map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    tenant: u.tenant.name,
    role: u.userRole === 'TENANT_ADMIN' ? 'Tenant Admin' : (u.role?.name || u.userRole),
    isActive: u.isActive,
    lastLogin: u.lastLogin ? u.lastLogin.toISOString().replace('T', ' ').substring(0, 19) : 'Never',
    initials: u.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
  }));
};

export const toggleUserStatus = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw createError('User not found', 404);

  const updated = await prisma.user.update({
    where: { id },
    data: { isActive: !user.isActive }
  });

  await prisma.auditLog.create({
    data: {
      action: updated.isActive ? 'USER_ENABLED' : 'USER_DISABLED',
      actor: 'SuperAdmin',
      entity: user.email,
      previousValue: `IsActive: ${user.isActive}`,
      newValue: `IsActive: ${updated.isActive}`
    }
  });

  return updated;
};

export const resetUserPassword = async (id: string, dto: any) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw createError('User not found', 404);

  const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);
  await prisma.user.update({
    where: { id },
    data: { passwordHash }
  });

  await prisma.auditLog.create({
    data: {
      action: 'PASSWORD_RESET',
      actor: 'SuperAdmin',
      entity: user.email,
      previousValue: 'PasswordHash Override',
      newValue: 'PasswordHash Override Success'
    }
  });

  return { success: true };
};

// ─── AUDIT LOGS ───────────────────────────────────────────────
export const getAuditLogs = async () => {
  return prisma.auditLog.findMany({
    orderBy: { timestamp: 'desc' }
  });
};

export const createSimulatedLog = async (dto: any) => {
  return prisma.auditLog.create({
    data: {
      action: dto.action,
      actor: dto.actor,
      entity: dto.entity,
      previousValue: dto.previousValue,
      newValue: dto.newValue,
      severity: dto.severity
    }
  });
};

// ─── GLOBAL RBAC ──────────────────────────────────────────────
export const getGlobalRoles = async () => {
  // Get all master roles seeded under system tenant
  const systemTenant = await prisma.tenant.findUnique({ where: { slug: 'system' } });
  if (!systemTenant) return [];

  const roles = await prisma.role.findMany({
    where: { tenantId: systemTenant.id },
    include: { permissions: { include: { permission: true } } }
  });

  return roles.map(r => ({
    id: r.id,
    name: r.name,
    description: r.description,
    isSystem: r.isSystem,
    permissions: r.permissions.map(p => `${p.permission.module.toLowerCase()}.${p.permission.action.toLowerCase()}`)
  }));
};

export const updateRolePermissions = async (id: string, dto: any) => {
  // Reset all permissions for this system role
  await prisma.rolePermission.deleteMany({ where: { roleId: id } });

  // Map and add new permissions
  const permissionKeys = dto.permissions as string[]; // e.g. ["room.view", "kot.update"]
  
  for (const key of permissionKeys) {
    const [mod, act] = key.split('.');
    const permission = await prisma.permission.findFirst({
      where: {
        module: mod.toUpperCase(),
        action: act.toUpperCase()
      }
    });

    if (permission) {
      await prisma.rolePermission.create({
        data: {
          roleId: id,
          permissionId: permission.id
        }
      });
    }
  }

  return { success: true };
};

export const createRole = async (dto: any) => {
  const systemTenant = await prisma.tenant.findUnique({ where: { slug: 'system' } });
  if (!systemTenant) throw createError('System node tenant not found', 500);

  const existing = await prisma.role.findFirst({
    where: { tenantId: systemTenant.id, name: dto.name }
  });
  if (existing) throw createError('Role name already exists', 400);

  const role = await prisma.role.create({
    data: {
      tenantId: systemTenant.id,
      name: dto.name,
      description: dto.description,
      isSystem: false
    }
  });

  return role;
};

export const deleteRole = async (id: string) => {
  const role = await prisma.role.findUnique({ where: { id } });
  if (!role) throw createError('Role not found', 404);
  if (role.isSystem) throw createError('Cannot delete predefined system roles', 400);

  await prisma.role.delete({ where: { id } });
  return { success: true };
};
