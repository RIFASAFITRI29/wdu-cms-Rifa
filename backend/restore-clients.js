const { PrismaClient } = require('./prisma/generated/client');
const prisma = new PrismaClient();

const clients = [
  { name: 'Kementerian Komunikasi dan Informatika', url: 'https://wahanadata.co.id/wp-content/uploads/2025/01/Kominfo-e1737704377593.png' },
  { name: 'Badan Pengawas Obat dan Makanan', url: 'https://wahanadata.co.id/wp-content/uploads/2025/01/bpom-1-768x524.png' },
  { name: 'Badan Pemeriksa Keuangan', url: 'https://wahanadata.co.id/wp-content/uploads/2025/01/bpk-150x150.png' },
  { name: 'BKPM', url: 'https://wahanadata.co.id/wp-content/uploads/2025/01/bkpm-1-768x524.png' },
  { name: 'PALJAYA', url: 'https://wahanadata.co.id/wp-content/uploads/2025/01/paljaya-768x768.png' },
  { name: 'BUMN', url: 'https://wahanadata.co.id/wp-content/uploads/2025/01/bumn-square-300x300.png' },
  { name: 'KPK', url: 'https://wahanadata.co.id/wp-content/uploads/2025/01/kpk-square-300x300.png' },
  { name: 'Kemendes', url: 'https://wahanadata.co.id/wp-content/uploads/2025/01/kemendes-square-300x300.png' }
];

async function seed() {
  console.log('Mengembalikan data klien...');
  for (const client of clients) {
    // Model name in prisma is partnerLogo
    await prisma.partnerLogo.create({
      data: client
    });
  }
  console.log('Data klien berhasil dikembalikan!');
}

seed().finally(() => prisma.$disconnect());
