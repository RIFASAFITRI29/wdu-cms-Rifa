const { PrismaClient } = require('./prisma/generated/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

async function main() {
  const passwordHash = await bcrypt.hash('WDU12345!', 10);
  
  const users = [
    { name: 'Adhi Wangsa', email: 'adhi@wahanadata.co.id', role: 'SUPER_ADMIN' },
    { name: 'Siti Aminah', email: 'siti@wahanadata.co.id', role: 'EDITOR' },
    { name: 'Budi Santoso', email: 'budi@wahanadata.co.id', role: 'EDITOR' },
    { name: 'Dewi Sartika', email: 'dewi@wahanadata.co.id', role: 'EDITOR' },
    { name: 'Rifan Ardiansyah', email: 'rifan@wahanadata.co.id', role: 'EDITOR' },
    { name: 'Maya Indah', email: 'maya@wahanadata.co.id', role: 'EDITOR' }
  ];

  console.log('Seeding more users...');
  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        ...u,
        passwordHash
      }
    });
  }
  console.log('Successfully seeded users.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
