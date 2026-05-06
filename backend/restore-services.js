const { PrismaClient } = require('./prisma/generated/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.service.deleteMany();
  
  const services = [
    { title: 'Riset Pasar', description: 'Jelajahi peluang baru dan pahami tren pasar dengan riset pasar yang mendalam.', icon: 'bar_chart', isActive: true, order: 1 },
    { title: 'Riset Data', description: 'Pengolahan data primer dan sekunder untuk menghasilkan wawasan strategis.', icon: 'database', isActive: true, order: 2 },
    { title: 'Analisis Data', description: 'Transformasi raw data menjadi aset strategis melalui pemrosesan dan validasi tingkat lanjut.', icon: 'analytics', isActive: true, order: 3 },
    { title: 'Survei', description: 'Pengumpulan data lapangan yang akurat dengan metodologi ilmiah yang teruji.', icon: 'poll', isActive: true, order: 4 },
    { title: 'Event Organizer', description: 'Penyelenggaraan acara profesional yang berfokus pada detail dan dampak yang berkesan.', icon: 'event', isActive: true, order: 5 },
    { title: 'Konsultasi IT', description: 'Konsultasi teknologi strategis untuk mengoptimalkan infrastruktur digital bisnis Anda.', icon: 'terminal', isActive: true, order: 6 },
  ];

  for (const s of services) {
    await prisma.service.create({ data: s });
  }

  console.log('Services restored to original 6 items.');
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
