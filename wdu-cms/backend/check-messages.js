const { PrismaClient } = require('./prisma/generated/client');
const prisma = new PrismaClient();

async function main() {
  const messages = await prisma.contactMessage.findMany();
  console.log('Messages count:', messages.length);
  messages.forEach(m => {
    console.log(`ID: ${m.id}, Name: ${m.name}, Subject: ${m.subject}, isRead: ${m.isRead}`);
  });
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
