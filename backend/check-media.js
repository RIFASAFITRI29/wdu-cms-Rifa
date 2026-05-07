const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const media = await prisma.media.findMany();
  console.log('Media count:', media.length);
  media.forEach(m => {
    console.log(`ID: ${m.id}, Filename: ${m.filename}, URL prefix: ${m.url.substring(0, 50)}...`);
  });
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
