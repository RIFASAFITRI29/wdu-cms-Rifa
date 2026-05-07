const { PrismaClient } = require('./prisma/generated/client');
const prisma = new PrismaClient();

async function list() {
  const pages = await prisma.page.findMany();
  console.log('--- DAFTAR SLUG DI DATABASE ---');
  pages.forEach(p => console.log(`- ${p.slug} (${p.title})`));
  console.log('-------------------------------');
}

list().finally(() => prisma.$disconnect());
