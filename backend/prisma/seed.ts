import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const SALT_ROUNDS = 12;

async function main() {
  console.log('Clearing existing database...');
  await prisma.auditLog.deleteMany({}).catch(() => {});
  await prisma.rolePermission.deleteMany({});
  await prisma.permission.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.subscription.deleteMany({});
  await prisma.tenantFeature.deleteMany({});
  await prisma.tenant.deleteMany({});

  console.log('Seeding system permissions...');
  const modulesList = [
    'DASHBOARD', 'TABLES', 'MENU', 'ORDERS', 'KOT', 'BILLING', 'POS', 
    'ROOMS', 'ROOM_TYPES', 'GUESTS', 'RESERVATIONS', 'CHECKIN', 'CHECKOUT', 
    'HOUSEKEEPING', 'INVENTORY', 'VENDORS', 'PURCHASES', 'PAYMENTS', 
    'REPORTS', 'SETTINGS', 'USERS', 'ROLES'
  ];
  const actionsList = ['CREATE', 'READ', 'UPDATE', 'DELETE'];
  
  const permissionsData = modulesList.flatMap(module => 
    actionsList.map(action => ({ module, action, description: `Can ${action.toLowerCase()} ${module.toLowerCase()}` }))
  );
  
  await prisma.permission.createMany({
    data: permissionsData,
    skipDuplicates: true
  });
  console.log('Permissions seeded.');

  // Helper to hash password
  const hashPassword = async (pass: string) => bcrypt.hash(pass, SALT_ROUNDS);

  console.log('Seeding Super Admin Tenant & User...');
  const superAdminPasswordHash = await hashPassword('superadminsecret');
  
  const systemTenant = await prisma.tenant.create({
    data: {
      name: 'Hoteloraa System Node',
      slug: 'system',
      businessType: 'HOTEL_RESTAURANT',
      isActive: true,
      email: 'support@hoteloraa.com',
      phone: '+919999999999',
      users: {
        create: {
          name: 'Global Administrator',
          email: 'SuperAdmin@hoteloraa.com',
          passwordHash: superAdminPasswordHash,
          userRole: 'SUPER_ADMIN',
          isActive: true
        }
      },
      subscription: {
        create: {
          plan: 'ENTERPRISE',
          status: 'ACTIVE',
          startDate: new Date(),
          amount: 0
        }
      }
    }
  });
  console.log('Super Admin Seeded.');

  console.log('Seeding Tenants...');
  const defaultPass = await hashPassword('password123');

  // 1. Royal Palace Hotel (Hotel + Restaurant)
  const t1 = await prisma.tenant.create({
    data: {
      name: 'Royal Palace Hotel',
      slug: 'royal-palace',
      businessType: 'HOTEL_RESTAURANT',
      isActive: true,
      email: 'admin@royalpalace.com',
      phone: '+918888888881',
      subscription: {
        create: {
          plan: 'ENTERPRISE',
          status: 'ACTIVE',
          startDate: new Date('2025-01-12'),
          amount: 14999
        }
      },
      features: {
        create: [
          { feature: 'POS', isEnabled: true },
          { feature: 'ROOMS', isEnabled: true },
          { feature: 'HOUSEKEEPING', isEnabled: true }
        ]
      },
      users: {
        create: [
          { name: 'Jubeda Khatun', email: 'admin@royalpalace.com', passwordHash: defaultPass, userRole: 'TENANT_ADMIN', isActive: true },
          { name: 'Faisal', email: 'faisal@royalpalace.com', passwordHash: defaultPass, userRole: 'MANAGER', isActive: true },
          { name: 'Ravi Verma', email: 'ravi@royalpalace.com', passwordHash: defaultPass, userRole: 'WAITER', isActive: true },
          { name: 'Tanvir', email: 'tanvir@royalpalace.com', passwordHash: defaultPass, userRole: 'CHEF', isActive: true }
        ]
      }
    }
  });

  // 2. Cafe Aroma (Restaurant Only)
  const t2 = await prisma.tenant.create({
    data: {
      name: 'Cafe Aroma',
      slug: 'cafe-aroma',
      businessType: 'RESTAURANT',
      isActive: true,
      email: 'contact@cafearoma.com',
      phone: '+918888888882',
      subscription: {
        create: {
          plan: 'STARTER',
          status: 'ACTIVE',
          startDate: new Date('2025-03-24'),
          amount: 4999
        }
      },
      features: {
        create: [
          { feature: 'POS', isEnabled: true },
          { feature: 'ROOMS', isEnabled: false },
          { feature: 'HOUSEKEEPING', isEnabled: false }
        ]
      },
      users: {
        create: [
          { name: 'Kabir Ahmed', email: 'contact@cafearoma.com', passwordHash: defaultPass, userRole: 'TENANT_ADMIN', isActive: true },
          { name: 'Mustkim', email: 'mustkim@caferoma.com', passwordHash: defaultPass, userRole: 'CASHIER', isActive: true }
        ]
      }
    }
  });

  // 3. Star Lodge (Lodging Only)
  const t3 = await prisma.tenant.create({
    data: {
      name: 'Star Lodge',
      slug: 'star-lodge',
      businessType: 'LODGING',
      isActive: true,
      email: 'manager@starlodge.com',
      phone: '+918888888883',
      subscription: {
        create: {
          plan: 'PROFESSIONAL',
          status: 'ACTIVE',
          startDate: new Date('2025-02-18'),
          amount: 9999
        }
      },
      features: {
        create: [
          { feature: 'POS', isEnabled: false },
          { feature: 'ROOMS', isEnabled: true },
          { feature: 'HOUSEKEEPING', isEnabled: true }
        ]
      },
      users: {
        create: [
          { name: 'Vikram Singh', email: 'manager@starlodge.com', passwordHash: defaultPass, userRole: 'TENANT_ADMIN', isActive: true },
          { name: 'Meera Nair', email: 'receptionist@starlodge.com', passwordHash: defaultPass, userRole: 'RECEPTIONIST', isActive: false }
        ]
      }
    }
  });

  // 4. Grand Oak Resort (Hotel + Restaurant - Suspended)
  const t4 = await prisma.tenant.create({
    data: {
      name: 'Grand Oak Resort',
      slug: 'grand-oak',
      businessType: 'HOTEL_RESTAURANT',
      isActive: false,
      email: 'admin@grandoak.com',
      phone: '+918888888884',
      subscription: {
        create: {
          plan: 'ENTERPRISE',
          status: 'INACTIVE',
          startDate: new Date('2024-11-05'),
          amount: 14999
        }
      },
      features: {
        create: [
          { feature: 'POS', isEnabled: true },
          { feature: 'ROOMS', isEnabled: true },
          { feature: 'HOUSEKEEPING', isEnabled: true }
        ]
      },
      users: {
        create: [
          { name: 'Amit Roy', email: 'admin@grandoak.com', passwordHash: defaultPass, userRole: 'TENANT_ADMIN', isActive: true }
        ]
      }
    }
  });

  console.log('Grand Oak Resort Seeded.');

  console.log('Seeding settings, tables, menu categories, and menu items...');

  // Seed Tenant Settings
  await prisma.tenantSettings.create({
    data: {
      tenantId: t1.id,
      taxRate: 18,
      invoicePrefix: "RPH",
      kotPrefix: "RPK",
    }
  });

  await prisma.tenantSettings.create({
    data: {
      tenantId: t2.id,
      taxRate: 5,
      invoicePrefix: "CA",
      kotPrefix: "CAK",
    }
  });

  await prisma.tenantSettings.create({
    data: {
      tenantId: t3.id,
      taxRate: 12,
      invoicePrefix: "SL",
      bookingPrefix: "SLB",
    }
  });

  // Seed Tables
  const tablesT1 = [
    { tenantId: t1.id, name: 'Table 1', capacity: 2, status: 'AVAILABLE' as const, floor: 'G', section: 'Main Hall' },
    { tenantId: t1.id, name: 'Table 2', capacity: 4, status: 'AVAILABLE' as const, floor: 'G', section: 'Main Hall' },
    { tenantId: t1.id, name: 'Table 3', capacity: 6, status: 'AVAILABLE' as const, floor: 'G', section: 'VIP' },
    { tenantId: t1.id, name: 'Table 4', capacity: 4, status: 'AVAILABLE' as const, floor: 'G', section: 'VIP' },
  ];
  await prisma.table.createMany({ data: tablesT1 });

  const tablesT2 = [
    { tenantId: t2.id, name: 'Table C1', capacity: 2, status: 'AVAILABLE' as const, floor: 'G', section: 'Inside' },
    { tenantId: t2.id, name: 'Table C2', capacity: 2, status: 'AVAILABLE' as const, floor: 'G', section: 'Inside' },
    { tenantId: t2.id, name: 'Table C3', capacity: 4, status: 'AVAILABLE' as const, floor: 'G', section: 'Outdoor' },
  ];
  await prisma.table.createMany({ data: tablesT2 });

  // Seed Menu Categories and Items for Royal Palace Hotel (t1)
  const startersCat = await prisma.menuCategory.create({
    data: { tenantId: t1.id, name: 'Starters', sortOrder: 1 }
  });
  const mainsCat = await prisma.menuCategory.create({
    data: { tenantId: t1.id, name: 'Mains', sortOrder: 2 }
  });
  const dessertsCat = await prisma.menuCategory.create({
    data: { tenantId: t1.id, name: 'Desserts', sortOrder: 3 }
  });
  const beveragesCat = await prisma.menuCategory.create({
    data: { tenantId: t1.id, name: 'Beverages', sortOrder: 4 }
  });

  await prisma.menuItem.createMany({
    data: [
      { tenantId: t1.id, menuCategoryId: startersCat.id, name: 'Paneer Tikka', description: 'Grilled paneer cubes marinated in spices', price: 240, costPrice: 90, isVeg: true, isAvailable: true },
      { tenantId: t1.id, menuCategoryId: startersCat.id, name: 'Chicken Tikka', description: 'Grilled chicken pieces marinated in spices', price: 290, costPrice: 110, isVeg: false, isAvailable: true },
      { tenantId: t1.id, menuCategoryId: mainsCat.id, name: 'Dal Makhani', description: 'Slow cooked black lentils with butter and cream', price: 180, costPrice: 60, isVeg: true, isAvailable: true },
      { tenantId: t1.id, menuCategoryId: mainsCat.id, name: 'Butter Chicken', description: 'Tandoori chicken cooked in rich tomato gravy', price: 320, costPrice: 130, isVeg: false, isAvailable: true },
      { tenantId: t1.id, menuCategoryId: mainsCat.id, name: 'Veg Biryani', description: 'Fragrant basmati rice cooked with fresh vegetables', price: 220, costPrice: 80, isVeg: true, isAvailable: true },
      { tenantId: t1.id, menuCategoryId: dessertsCat.id, name: 'Gulab Jamun', description: 'Sweet milk dumplings dipped in sugar syrup', price: 90, costPrice: 30, isVeg: true, isAvailable: true },
      { tenantId: t1.id, menuCategoryId: dessertsCat.id, name: 'Vanilla Ice Cream', description: 'Classic vanilla flavor scoop', price: 80, costPrice: 20, isVeg: true, isAvailable: true },
      { tenantId: t1.id, menuCategoryId: beveragesCat.id, name: 'Masala Chai', description: 'Traditional spiced indian tea', price: 40, costPrice: 10, isVeg: true, isAvailable: true },
      { tenantId: t1.id, menuCategoryId: beveragesCat.id, name: 'Fresh Lime Soda', description: 'Refreshing sweet & salty lime drink', price: 70, costPrice: 15, isVeg: true, isAvailable: true },
    ]
  });

  // Seed Menu Categories and Items for Cafe Aroma (t2)
  const coffeeCat = await prisma.menuCategory.create({
    data: { tenantId: t2.id, name: 'Coffee', sortOrder: 1 }
  });
  const snacksCat = await prisma.menuCategory.create({
    data: { tenantId: t2.id, name: 'Snacks', sortOrder: 2 }
  });
  const dessertsCat2 = await prisma.menuCategory.create({
    data: { tenantId: t2.id, name: 'Desserts', sortOrder: 3 }
  });

  await prisma.menuItem.createMany({
    data: [
      { tenantId: t2.id, menuCategoryId: coffeeCat.id, name: 'Espresso', description: 'Strong black coffee', price: 100, costPrice: 20, isVeg: true, isAvailable: true },
      { tenantId: t2.id, menuCategoryId: coffeeCat.id, name: 'Cappuccino', description: 'Espresso with steamed milk foam', price: 140, costPrice: 35, isVeg: true, isAvailable: true },
      { tenantId: t2.id, menuCategoryId: coffeeCat.id, name: 'Cafe Latte', description: 'Espresso with steamed milk', price: 150, costPrice: 40, isVeg: true, isAvailable: true },
      { tenantId: t2.id, menuCategoryId: snacksCat.id, name: 'Cheese Sandwich', description: 'Grilled bread with cheddar cheese', price: 120, costPrice: 35, isVeg: true, isAvailable: true },
      { tenantId: t2.id, menuCategoryId: snacksCat.id, name: 'Chicken Burger', description: 'Burger with crispy chicken patty', price: 180, costPrice: 65, isVeg: false, isAvailable: true },
      { tenantId: t2.id, menuCategoryId: dessertsCat2.id, name: 'Chocolate Brownie', description: 'Rich chocolate warm brownie', price: 160, costPrice: 50, isVeg: true, isAvailable: true },
    ]
  });

  console.log('Tables, Categories, and Items Seeded.');

  console.log('Seeding simulated Audit Logs...');
  await prisma.auditLog.createMany({
    data: [
      { action: 'TENANT_CREATED', actor: 'system-provisioner', entity: 'Star Lodge', previousValue: 'None', newValue: 'Type: LODGING | Plan: PROFESSIONAL', severity: 'INFO', timestamp: new Date('2026-06-19T10:00:00Z') },
      { action: 'TENANT_SUSPENDED', actor: 'SuperAdmin@hoteloraa.com', entity: 'Grand Oak Resort', previousValue: 'Status: ACTIVE', newValue: 'Status: SUSPENDED', severity: 'WARNING', timestamp: new Date('2026-06-19T12:30:00Z') },
      { action: 'SUBSCRIPTION_UPGRADED', actor: 'billing-portal', entity: 'Royal Palace Hotel', previousValue: 'Plan: PROFESSIONAL', newValue: 'Plan: ENTERPRISE', severity: 'SUCCESS', timestamp: new Date('2026-06-19T14:15:00Z') },
      { action: 'USER_DISABLED', actor: 'manager@starlodge.com', entity: 'receptionist@starlodge.com', previousValue: 'IsActive: TRUE', newValue: 'IsActive: FALSE', severity: 'DANGER', timestamp: new Date('2026-06-19T15:20:00Z') }
    ]
  });

  console.log('Seeding complete! All systems operational.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
