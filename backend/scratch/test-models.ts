import prisma from '../src/prisma';

async function test() {
  try {
    const count = await prisma.gallery.count();
    console.log('Gallery count:', count);
    const clients = await prisma.client.count();
    console.log('Client count:', clients);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

test();
