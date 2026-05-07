const { PrismaClient } = require('./prisma/generated/client');
const prisma = new PrismaClient();

async function main() {
  const media = await prisma.media.findMany({ take: 5 });
  console.log(JSON.stringify(media, (key, value) => 
    key === 'url' && value.length > 100 ? value.substring(0, 50) + '...' : value
  , 2));
}

main().finally(() => prisma.$disconnect());
