const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  const id = '133ce8ad-dd3c-4dcd-a809-28e5e78c2ed5';
  const tenantId = '2c1778b1-1d67-4256-8372-2ee4610f3bc8';
  
  const user = await prisma.user.findFirst({
    where: { id, tenantId, isActive: true },
  });
  
  console.log("Found user:", user ? user.name : "NULL");
}

test().catch(console.error).finally(() => prisma.$disconnect());
