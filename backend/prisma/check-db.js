"use strict";var _client = require('@prisma/client');

const prisma = new (0, _client.PrismaClient)();

async function checkDatabase() {
  console.log('\n=== TENANTS ===');
  const tenants = await prisma.tenant.findMany({ select: { id: true, name: true, slug: true, isActive: true } });
  tenants.forEach(t => console.log(`  [${t.isActive ? 'ACTIVE' : 'INACTIVE'}] ${t.name} (slug: ${t.slug})`));

  console.log('\n=== USERS ===');
  const users = await prisma.user.findMany({ select: { name: true, email: true, userRole: true, isActive: true, tenantId: true } });
  if (users.length === 0) {
    console.log('  ⚠️  NO USERS FOUND - Database is missing all users!');
  } else {
    users.forEach(u => console.log(`  [${u.isActive ? 'ACTIVE' : 'INACTIVE'}] ${u.userRole.padEnd(15)} ${u.email} (${u.name})`));
  }

  console.log(`\nTotal tenants: ${tenants.length}, Total users: ${users.length}`);
}

checkDatabase()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
