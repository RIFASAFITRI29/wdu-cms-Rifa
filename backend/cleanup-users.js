const { PrismaClient } = require('./prisma/generated/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  
  // Keep one SUPER_ADMIN and one EDITOR
  const superAdminToKeep = users.find(u => u.role === 'SUPER_ADMIN');
  const editorToKeep = users.find(u => u.role === 'EDITOR');

  const idsToKeep = [];
  if (superAdminToKeep) idsToKeep.push(superAdminToKeep.id);
  if (editorToKeep) idsToKeep.push(editorToKeep.id);

  console.log(`Keeping: ${superAdminToKeep?.name} and ${editorToKeep?.name}`);

  const deleteResult = await prisma.user.deleteMany({
    where: {
      id: { notIn: idsToKeep }
    }
  });

  console.log(`Deleted ${deleteResult.count} extra users.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
