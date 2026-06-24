const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      tenantId: true,
      userRole: true
    }
  });
  console.log('--- Users ---');
  users.forEach(u => {
    console.log(`User: ${u.name} | Email: ${u.email} | TenantID: ${u.tenantId} | Role: ${u.userRole}`);
  });

  const rooms = await prisma.room.findMany({
    select: {
      id: true,
      number: true,
      tenantId: true,
      status: true
    }
  });
  console.log('\n--- Rooms ---');
  rooms.forEach(r => {
    console.log(`Room: ${r.number} | TenantID: ${r.tenantId} | Status: ${r.status}`);
  });

  const tenants = await prisma.tenant.findMany();
  console.log('\n--- Tenants ---');
  tenants.forEach(t => {
    console.log(`Tenant: ${t.id} | Name: ${t.name}`);
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
