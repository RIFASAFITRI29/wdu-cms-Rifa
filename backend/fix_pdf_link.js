const { PrismaClient } = require('./prisma/generated/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.siteConfig.update({
    where: { key: 'company_profile_url' },
    data: { value: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' }
  });
  console.log('Company Profile URL updated to placeholder.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
