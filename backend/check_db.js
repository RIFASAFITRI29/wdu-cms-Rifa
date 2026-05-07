const { PrismaClient } = require('./prisma/generated/client');
const prisma = new PrismaClient();

async function main() {
  const counts = {
    users: await prisma.user.count(),
    media: await prisma.media.count(),
    partners: await prisma.experiencePartner.count(),
    projects: await prisma.project.count(),
    gallery: await prisma.documentationGallery.count(),
    configs: await prisma.siteConfig.count(),
  };
  console.log(JSON.stringify(counts, null, 2));
}

main().finally(() => prisma.$disconnect());
