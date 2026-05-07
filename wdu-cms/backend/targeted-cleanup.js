const { PrismaClient } = require('./prisma/generated/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Targeted cleanup starting...');

  // 1. Remove English duplicate pages (Keep Indonesian ones)
  const englishSlugs = ['about', 'services', 'experience', 'contact'];
  await prisma.page.deleteMany({
    where: { slug: { in: englishSlugs } }
  });
  console.log('Removed English duplicate pages.');

  // 2. Remove "seed-service-X" duplicates (Keep the ones with cuid IDs)
  await prisma.service.deleteMany({
    where: { id: { startsWith: 'seed-service-' } }
  });
  console.log('Removed seed service duplicates.');

  // 3. Remove "seed-media-X" duplicates
  await prisma.media.deleteMany({
    where: { id: { startsWith: 'seed-media-' } }
  });
  console.log('Removed seed media duplicates.');

  // 4. Handle messages (Keep only 3 most recent)
  const allMessages = await prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } });
  if (allMessages.length > 3) {
    const idsToDelete = allMessages.slice(3).map(m => m.id);
    await prisma.contactMessage.deleteMany({ where: { id: { in: idsToDelete } } });
  }
  console.log('Cleanup messages.');

  console.log('Cleanup finished! Database is now clean.');
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
