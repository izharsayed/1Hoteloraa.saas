"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _client = require('@prisma/client');
var _bcryptjs = require('bcryptjs'); var _bcryptjs2 = _interopRequireDefault(_bcryptjs);

const prisma = new (0, _client.PrismaClient)();

async function addMissingUsers() {
  const SALT_ROUNDS = 12;
  const password = await _bcryptjs2.default.hash('password123', SALT_ROUNDS);

  // Find Royal Palace Hotel tenant
  const tenant = await prisma.tenant.findFirst({
    where: { slug: 'royal-palace' }
  });

  if (!tenant) {
    console.error('Royal Palace tenant not found!');
    process.exit(1);
  }

  console.log(`Found tenant: ${tenant.name} (${tenant.id})`);

  const usersToAdd = [
    { name: 'Priya Sharma',  email: 'priya@royalpalace.com',  userRole: 'RECEPTIONIST'  },
    { name: 'Sunita Devi',   email: 'sunita@royalpalace.com', userRole: 'HOUSEKEEPING'  },
    { name: 'Rahul Mehta',   email: 'rahul@royalpalace.com',  userRole: 'ACCOUNTANT'    },
  ];

  for (const userData of usersToAdd) {
    // Check if user already exists
    const existing = await prisma.user.findFirst({
      where: { email: userData.email, tenantId: tenant.id }
    });

    if (existing) {
      console.log(`User ${userData.email} already exists, skipping.`);
      continue;
    }

    const user = await prisma.user.create({
      data: {
        tenantId: tenant.id,
        name: userData.name,
        email: userData.email,
        passwordHash: password,
        userRole: userData.userRole,
        isActive: true,
      }
    });

    console.log(`✅ Created ${userData.userRole}: ${userData.name} (${userData.email})`);
  }

  console.log('\nAll demo users are ready!');
  console.log('---');
  console.log('Receptionist: priya@royalpalace.com / password123');
  console.log('Housekeeping: sunita@royalpalace.com / password123');
  console.log('Accountant:   rahul@royalpalace.com / password123');
}

addMissingUsers()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
