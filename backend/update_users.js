const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    // Attempt to rename the enum value in PostgreSQL
    await prisma.$executeRawUnsafe(`ALTER TYPE "UserRole" RENAME VALUE 'WAITER' TO 'CAPTAIN';`);
    console.log('Successfully renamed WAITER to CAPTAIN in UserRole enum.');
  } catch (e) {
    console.error('Failed to rename enum (might already be renamed or unsupported). Error:', e.message);
  }

  try {
    // Attempt to update users explicitly if any got stuck as text
    const result = await prisma.$executeRawUnsafe(`UPDATE users SET "userRole" = 'CAPTAIN' WHERE "userRole"::text = 'WAITER';`);
    console.log(`Updated users table directly: ${result} row(s) modified.`);
  } catch(err) {
    console.error('Failed to update users table directly:', err.message);
  }

  // Double check existing user
  const captainUser = await prisma.user.findFirst({ where: { userRole: 'CAPTAIN' } });
  if (captainUser) {
    console.log('Confirmed user with role CAPTAIN exists:', captainUser.email);
  } else {
    console.log('No user with role CAPTAIN found. You may need to check the DB manually.');
  }
}

main()
  .then(() => console.log('Done'))
  .catch(console.error)
  .finally(() => prisma.$disconnect());
