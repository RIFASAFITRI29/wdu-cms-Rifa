const { PrismaClient } = require('./prisma/generated/client');
const prisma = new PrismaClient();

async function main() {
  const configs = await prisma.siteConfig.findMany({
    where: { key: 'company_profile_url' }
  });
  console.log(JSON.stringify(configs, null, 2));
}

main().finally(() => prisma.$disconnect());
