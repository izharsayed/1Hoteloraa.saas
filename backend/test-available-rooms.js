const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const roomsService = require('./src/modules/rooms/rooms.service');

async function main() {
  const tenantId = 'da083ab1-5ba8-48b2-af29-3f4b01223d4a'; // Royal Palace Hotel tenant ID
  const checkIn = new Date('2026-06-25');
  const checkOut = new Date('2026-06-27');
  
  console.log(`Querying available rooms for tenant: ${tenantId} from ${checkIn.toISOString()} to ${checkOut.toISOString()}`);
  
  try {
    const rooms = await roomsService.getAvailableRooms(tenantId, checkIn, checkOut);
    console.log('Available Rooms count:', rooms.length);
    rooms.forEach(r => {
      console.log(`Room: ${r.number} | Type: ${r.roomType?.name} | Price: ${r.roomType?.basePrice}`);
    });
  } catch (err) {
    console.error('Error fetching rooms:', err);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
