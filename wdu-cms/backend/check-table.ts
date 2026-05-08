import { PrismaClient } from './prisma/generated/client';

const prisma = new PrismaClient();

async function checkTable() {
  try {
    const tableInfo = await prisma.$queryRaw`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'ContactMessage'
    `;
    console.log('--- STRUCTURE OF ContactMessage ---');
    console.table(tableInfo);
  } catch (error) {
    console.error('Error checking table:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkTable();
