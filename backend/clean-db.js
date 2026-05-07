const { PrismaClient } = require('./prisma/generated/client');
const prisma = new PrismaClient();

async function clean() {
  const englishSlugs = ['about', 'services', 'experience', 'contact', 'web'];
  console.log(`Menghapus slug duplikat: ${englishSlugs.join(', ')}...`);
  
  const result = await prisma.page.deleteMany({
    where: {
      slug: { in: englishSlugs }
    }
  });
  
  console.log(`Berhasil menghapus ${result.count} data duplikat.`);
}

clean()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
