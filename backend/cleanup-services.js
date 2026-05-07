const { PrismaClient } = require('./prisma/generated/client');
const prisma = new PrismaClient();

async function main() {
  // Clear all services
  await prisma.service.deleteMany();
  
  const services = [
    { title: 'Riset Sosial & Politik', description: 'Survei opini publik, pemetaan politik, dan riset kebijakan sosial.', icon: 'public', order: 1 },
    { title: 'Riset Ekonomi & Pembangunan', description: 'Analisis dampak ekonomi, studi kelayakan, dan perencanaan wilayah.', icon: 'trending_up', order: 2 },
    { title: 'Manajemen Pemasaran', description: 'Riset perilaku konsumen, audit merek, dan strategi penetapan harga.', icon: 'ads_click', order: 3 },
    { title: 'Lingkungan Hidup', description: 'Studi AMDAL, pemetaan sumber daya alam, dan konservasi lingkungan.', icon: 'eco', order: 4 },
    { title: 'Teknologi Informasi (IoT)', description: 'Implementasi sensor pintar, analisis big data, dan solusi cloud.', icon: 'memory', order: 5 },
    { title: 'Pelatihan & Event Organizing', description: 'Workshop profesional, seminar teknis, dan manajemen acara korporat.', icon: 'event', order: 6 },
  ];

  for (const s of services) {
    await prisma.service.create({ data: s });
  }

  console.log('Services cleaned and reset to 6 core services.');
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
