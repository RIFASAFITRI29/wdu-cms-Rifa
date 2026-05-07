const { PrismaClient } = require('./prisma/generated/client');
const prisma = new PrismaClient();

async function main() {
  const p = await prisma.page.findUnique({ where: { slug: 'tentang-kami' } });
  console.log(JSON.stringify(p, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
