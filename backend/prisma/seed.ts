import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const SALT_ROUNDS = 12;

async function main() {
  console.log('Clearing existing database...');
  // Delete in reverse-dependency order to avoid FK constraint errors
  await prisma.auditLog.deleteMany({}).catch(() => {});
  await prisma.notification.deleteMany({}).catch(() => {});
  await prisma.rolePermission.deleteMany({}).catch(() => {});
  await prisma.permission.deleteMany({}).catch(() => {});
  await prisma.kOTItem.deleteMany({}).catch(() => {});
  await prisma.kOT.deleteMany({}).catch(() => {});
  await prisma.orderItem.deleteMany({}).catch(() => {});
  await prisma.order.deleteMany({}).catch(() => {});
  await prisma.payment.deleteMany({}).catch(() => {});
  await prisma.folioItem.deleteMany({}).catch(() => {});
  await prisma.reservation.deleteMany({}).catch(() => {});
  await prisma.housekeeping.deleteMany({}).catch(() => {});
  await prisma.purchaseItem.deleteMany({}).catch(() => {});
  await prisma.purchase.deleteMany({}).catch(() => {});
  await prisma.inventoryItem.deleteMany({}).catch(() => {});
  await prisma.vendor.deleteMany({}).catch(() => {});
  await prisma.menuItem.deleteMany({}).catch(() => {});
  await prisma.menuCategory.deleteMany({}).catch(() => {});
  await prisma.table.deleteMany({}).catch(() => {});
  await prisma.room.deleteMany({}).catch(() => {});
  await prisma.roomType.deleteMany({}).catch(() => {});
  await prisma.guest.deleteMany({}).catch(() => {});
  await prisma.tenantSettings.deleteMany({}).catch(() => {});
  await prisma.tenantFeature.deleteMany({}).catch(() => {});
  await prisma.subscription.deleteMany({}).catch(() => {});
  await prisma.user.deleteMany({}).catch(() => {});
  await prisma.tenant.deleteMany({}).catch(() => {});

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
          { name: 'Jubeda Khatun',  email: 'admin@royalpalace.com',        passwordHash: defaultPass, userRole: 'TENANT_ADMIN',  isActive: true },
          { name: 'Faisal Ahmed',   email: 'faisal@royalpalace.com',       passwordHash: defaultPass, userRole: 'MANAGER',       isActive: true },
          { name: 'Ravi Verma',     email: 'ravi@royalpalace.com',         passwordHash: defaultPass, userRole: 'WAITER',        isActive: true },
          { name: 'Tanvir Hussain', email: 'tanvir@royalpalace.com',       passwordHash: defaultPass, userRole: 'CHEF',          isActive: true },
          { name: 'Priya Sharma',   email: 'priya@royalpalace.com',        passwordHash: defaultPass, userRole: 'RECEPTIONIST',  isActive: true },
          { name: 'Sunita Devi',    email: 'sunita@royalpalace.com',       passwordHash: defaultPass, userRole: 'HOUSEKEEPING',  isActive: true },
          { name: 'Rahul Mehta',    email: 'rahul@royalpalace.com',        passwordHash: defaultPass, userRole: 'ACCOUNTANT',    isActive: true },
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
      { tenantId: t1.id, menuCategoryId: startersCat.id, name: 'Paneer Tikka', description: 'Grilled paneer cubes marinated in spices', price: 240, costPrice: 90, isVeg: true, isAvailable: true, imageUrl: '/images/dishes/paneer_tikka.png' },
      { tenantId: t1.id, menuCategoryId: startersCat.id, name: 'Chicken Tikka', description: 'Grilled chicken pieces marinated in spices', price: 290, costPrice: 110, isVeg: false, isAvailable: true, imageUrl: '/images/dishes/chicken_tikka.png' },
      { tenantId: t1.id, menuCategoryId: mainsCat.id, name: 'Dal Makhani', description: 'Slow cooked black lentils with butter and cream', price: 180, costPrice: 60, isVeg: true, isAvailable: true, imageUrl: '/images/dishes/dal_makhani.png' },
      { tenantId: t1.id, menuCategoryId: mainsCat.id, name: 'Butter Chicken', description: 'Tandoori chicken cooked in rich tomato gravy', price: 320, costPrice: 130, isVeg: false, isAvailable: true, imageUrl: '/images/dishes/butter_chicken.png' },
      { tenantId: t1.id, menuCategoryId: mainsCat.id, name: 'Veg Biryani', description: 'Fragrant basmati rice cooked with fresh vegetables', price: 220, costPrice: 80, isVeg: true, isAvailable: true, imageUrl: '/images/dishes/veg_biryani.png' },
      { tenantId: t1.id, menuCategoryId: dessertsCat.id, name: 'Gulab Jamun', description: 'Sweet milk dumplings dipped in sugar syrup', price: 90, costPrice: 30, isVeg: true, isAvailable: true, imageUrl: '/images/dishes/gulab_jamun.png' },
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
      { tenantId: t2.id, menuCategoryId: coffeeCat.id, name: 'Cappuccino', description: 'Espresso with steamed milk foam', price: 140, costPrice: 35, isVeg: true, isAvailable: true, imageUrl: '/images/dishes/cappuccino.png' },
      { tenantId: t2.id, menuCategoryId: coffeeCat.id, name: 'Cafe Latte', description: 'Espresso with steamed milk', price: 150, costPrice: 40, isVeg: true, isAvailable: true },
      { tenantId: t2.id, menuCategoryId: snacksCat.id, name: 'Cheese Sandwich', description: 'Grilled bread with cheddar cheese', price: 120, costPrice: 35, isVeg: true, isAvailable: true, imageUrl: '/images/dishes/cheese_sandwich.png' },
      { tenantId: t2.id, menuCategoryId: snacksCat.id, name: 'Chicken Burger', description: 'Burger with crispy chicken patty', price: 180, costPrice: 65, isVeg: false, isAvailable: true, imageUrl: '/images/dishes/chicken_burger.png' },
      { tenantId: t2.id, menuCategoryId: dessertsCat2.id, name: 'Chocolate Brownie', description: 'Rich chocolate warm brownie', price: 160, costPrice: 50, isVeg: true, isAvailable: true, imageUrl: '/images/dishes/chocolate_brownie.png' },
    ]
  });

  console.log('Tables, Categories, and Items Seeded.');

  console.log('Seeding Room Types, Rooms, and Guests...');

  // 1. Room Types for Royal Palace Hotel (t1)
  const standardTypeT1 = await prisma.roomType.create({
    data: {
      tenantId: t1.id,
      name: 'Standard Room',
      description: 'Cozy room with essential amenities for a comfortable stay.',
      basePrice: 2500,
      maxOccupancy: 2,
      amenities: ['Free Wi-Fi', 'TV', 'Air Conditioning', 'Geyser'],
    }
  });

  const deluxeTypeT1 = await prisma.roomType.create({
    data: {
      tenantId: t1.id,
      name: 'Deluxe Room',
      description: 'Spacious room offering premium comfort and a beautiful city view.',
      basePrice: 4500,
      maxOccupancy: 2,
      amenities: ['Free Wi-Fi', 'TV', 'Air Conditioning', 'Mini Bar', 'City View', 'Safe'],
    }
  });

  const suiteTypeT1 = await prisma.roomType.create({
    data: {
      tenantId: t1.id,
      name: 'Executive Suite',
      description: 'Luxurious suite with a separate living area, bathtub, and balcony.',
      basePrice: 9000,
      maxOccupancy: 4,
      amenities: ['Free Wi-Fi', 'TV', 'Air Conditioning', 'Mini Bar', 'Bathtub', 'Balcony', 'Room Service'],
    }
  });

  // Rooms for t1
  await prisma.room.createMany({
    data: [
      { tenantId: t1.id, roomTypeId: standardTypeT1.id, number: '101', floor: '1', description: 'Near elevator', status: 'AVAILABLE' },
      { tenantId: t1.id, roomTypeId: standardTypeT1.id, number: '102', floor: '1', description: 'Quiet end room', status: 'AVAILABLE' },
      { tenantId: t1.id, roomTypeId: deluxeTypeT1.id, number: '201', floor: '2', description: 'With balcony', status: 'AVAILABLE' },
      { tenantId: t1.id, roomTypeId: deluxeTypeT1.id, number: '202', floor: '2', description: 'Twin beds', status: 'AVAILABLE' },
      { tenantId: t1.id, roomTypeId: suiteTypeT1.id, number: '301', floor: '3', description: 'Penthouse view suite', status: 'AVAILABLE' },
    ]
  });

  // Room Types for Star Lodge (t3)
  const singleTypeT3 = await prisma.roomType.create({
    data: {
      tenantId: t3.id,
      name: 'Single Room',
      description: 'Perfect for solo travelers.',
      basePrice: 1500,
      maxOccupancy: 1,
      amenities: ['Free Wi-Fi', 'Fan'],
    }
  });

  const doubleTypeT3 = await prisma.roomType.create({
    data: {
      tenantId: t3.id,
      name: 'Double Room',
      description: 'Comfortable double bed room.',
      basePrice: 2800,
      maxOccupancy: 2,
      amenities: ['Free Wi-Fi', 'TV', 'Air Conditioning'],
    }
  });

  // Rooms for t3
  await prisma.room.createMany({
    data: [
      { tenantId: t3.id, roomTypeId: singleTypeT3.id, number: '101', floor: '1', description: 'Ground floor single room', status: 'AVAILABLE' },
      { tenantId: t3.id, roomTypeId: doubleTypeT3.id, number: '102', floor: '1', description: 'Double room facing lawn', status: 'AVAILABLE' },
    ]
  });

  // Guests for t1
  await prisma.guest.createMany({
    data: [
      {
        tenantId: t1.id,
        name: 'Rajesh Kumar',
        email: 'rajesh@gmail.com',
        phone: '9876543210',
        idType: 'AADHAAR',
        idNumber: '1234-5678-9012',
        address: '123 Mall Road',
        city: 'Shimla',
        country: 'India',
        nationality: 'Indian',
      },
      {
        tenantId: t1.id,
        name: 'Priya Patel',
        email: 'priya@gmail.com',
        phone: '9876543211',
        idType: 'DRIVING_LICENSE',
        idNumber: 'DL-9876543',
        address: '456 Ring Road',
        city: 'Ahmedabad',
        country: 'India',
        nationality: 'Indian',
      },
      {
        tenantId: t1.id,
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '5550199',
        idType: 'PASSPORT',
        idNumber: 'A1234567',
        address: '789 Broadway',
        city: 'New York',
        country: 'USA',
        nationality: 'American',
      }
    ]
  });

  console.log('Room Types, Rooms, and Guests Seeded.');


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
