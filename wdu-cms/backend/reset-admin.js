const { PrismaClient } = require('./prisma/generated/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

async function main() {
  const email = 'admin@wdu.co.id';
  const password = 'admin123';
  const passwordHash = await bcrypt.hash(password, 10);
  
  console.log('Resetting Admin credentials...');
  
  await prisma.user.upsert({
    where: { email: email },
    update: {
      passwordHash: passwordHash,
      role: 'SUPER_ADMIN',
      name: 'Administrator WDU'
    },
    create: {
      email: email,
      name: 'Administrator WDU',
      passwordHash: passwordHash,
      role: 'SUPER_ADMIN'
    }
  });

  console.log('-----------------------------------');
  console.log('SUCCESS! Admin account updated.');
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);
  console.log('-----------------------------------');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
