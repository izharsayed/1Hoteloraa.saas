const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const tenants = await prisma.tenant.findMany();
  for (const tenant of tenants) {
    const items = [
      { name: 'Basmati Rice', unit: 'KG', costPrice: 60, quantity: 50 },
      { name: 'Chicken Breast', unit: 'KG', costPrice: 250, quantity: 20 },
      { name: 'Tomatoes', unit: 'KG', costPrice: 40, quantity: 30 },
      { name: 'Milk', unit: 'LITRE', costPrice: 50, quantity: 40 },
      { name: 'Hand Wash Soap', unit: 'BOTTLE', costPrice: 85, quantity: 100 }
    ];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      await prisma.inventoryItem.upsert({
        where: { tenantId_sku: { tenantId: tenant.id, sku: 'SKU-' + i } },
        update: {},
        create: {
          tenantId: tenant.id,
          name: item.name,
          sku: 'SKU-' + i,
          unit: item.unit,
          costPrice: item.costPrice,
          quantity: item.quantity,
          minimumStock: 5
        }
      });
    }
  }
  console.log('Successfully seeded inventory items!');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
