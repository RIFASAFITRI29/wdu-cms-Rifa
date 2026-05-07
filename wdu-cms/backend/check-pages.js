const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const pages = await prisma.page.findMany();
  console.log('Pages count:', pages.length);
  pages.forEach(p => {
    console.log(`ID: ${p.id}, Title: ${p.title}, Slug: ${p.slug}`);
  });
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
