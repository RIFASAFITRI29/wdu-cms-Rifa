import { PrismaClient } from './generated/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('admin123', 12);
  
  await prisma.user.upsert({
    where: { email: 'admin@wdu.co.id' },
    update: {},
    create: {
      email: 'admin@wdu.co.id',
      name: 'Super Admin',
      passwordHash,
      role: 'SUPER_ADMIN',
    },
  });

  const editorHash = await bcrypt.hash('editor123', 12);
  await prisma.user.upsert({
    where: { email: 'editor@wdu.co.id' },
    update: {},
    create: {
      email: 'editor@wdu.co.id',
      name: 'Rifa Editor',
      passwordHash: editorHash,
      role: 'EDITOR',
    },
  });

  // Seed Services
  const services = [
    { title: 'Riset Pasar', description: 'Jelajahi peluang baru dan pahami tren pasar dengan riset pasar yang mendalam.', icon: 'bar_chart', order: 1 },
    { title: 'Riset Data', description: 'Pengolahan data primer dan sekunder untuk menghasilkan wawasan strategis.', icon: 'database', order: 2 },
    { title: 'Analisis Data', description: 'Transformasi raw data menjadi aset strategis melalui pemrosesan dan validasi tingkat lanjut.', icon: 'analytics', order: 3 },
    { title: 'Survei', description: 'Pengumpulan data lapangan yang akurat dengan metodologi ilmiah yang teruji.', icon: 'poll', order: 4 },
    { title: 'Event Organizer', description: 'Penyelenggaraan acara profesional yang berfokus pada detail dan dampak yang berkesan.', icon: 'event', order: 5 },
    { title: 'Konsultasi IT', description: 'Konsultasi teknologi strategis untuk mengoptimalkan infrastruktur digital bisnis Anda.', icon: 'terminal', order: 6 },
  ];

  for (const s of services) {
    await prisma.service.upsert({
      where: { id: `seed-service-${s.order}` },
      update: s,
      create: { ...s, id: `seed-service-${s.order}`, isActive: true }
    });
  }

  // Seed Projects
  const projects = [
    { title: 'Digitalization Study 2024', client: 'BPOM', category: 'Research', year: 2024, isHighlight: true, order: 1 },
    { title: 'Market Trends Report', client: 'Kominfo', category: 'Analytics', year: 2023, isHighlight: false, order: 2 },
  ];

  for (const p of projects) {
    await prisma.project.create({ data: p });
  }

  // Seed Initial Media Assets
  const media = [
    { filename: 'wdu-building.jpg', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070', mimeType: 'image/jpeg', size: 2400000, uploadedBy: 'System' },
    { filename: 'bpom-logo.png', url: 'https://images.unsplash.com/photo-1614850523296-e8c0a005080b?q=80&w=2070', mimeType: 'image/png', size: 45000, uploadedBy: 'System' },
    { filename: 'research-team.jpg', url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070', mimeType: 'image/jpeg', size: 1500000, uploadedBy: 'System' },
  ];

  for (const m of media) {
    await prisma.media.upsert({
      where: { id: `seed-media-${m.filename}` },
      update: m,
      create: { ...m, id: `seed-media-${m.filename}` }
    });
  }

  // Seed Contact Messages
  const messages = [
    { name: 'Budi Santoso', email: 'budi@example.com', subject: 'Tanya Layanan Riset', message: 'Halo, saya tertarik dengan layanan riset pasar untuk UMKM. Bisa minta brosurnya?', isRead: false },
    { name: 'Siti Aminah', email: 'siti@perusahaan.co.id', subject: 'Kerjasama Instansi', message: 'Kami dari Dinas Kesehatan ingin berdiskusi mengenai pengolahan data survey 2025.', isRead: false },
    { name: 'Andi Wijaya', email: 'andi@startup.id', subject: 'Konsultasi IT', message: 'Apakah WDU menyediakan jasa audit infrastruktur cloud?', isRead: true },
  ];

  for (const msg of messages) {
    await prisma.contactMessage.create({ data: msg });
  }

  // Seed Gallery
  const gallery = [
    { title: 'Kunjungan Kerja BPOM 2024', url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070', order: 1 },
    { title: 'Workshop Analisis Data Nasional', url: 'https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?q=80&w=2070', order: 2 },
    { title: 'Survey Lapangan Pertanian Jabar', url: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=2070', order: 3 },
  ];

  for (const g of gallery) {
    await prisma.documentationGallery.create({ data: g });
  }

  // Seed Experience Partners
  const partners = [
    { year: '2024', category: 'Public Sector', logoUrl: 'https://images.unsplash.com/photo-1599305090748-36656ca0104d?q=80&w=200', order: 1 },
    { year: '2024', category: 'Financial Services', logoUrl: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=200', order: 2 },
    { year: '2023', category: 'Public Sector', logoUrl: 'https://images.unsplash.com/photo-1557200134-90327ee9fafa?q=80&w=200', order: 3 },
  ];

  for (const p of partners) {
    await prisma.experiencePartner.create({ data: p });
  }

  console.log('Seed data created successfully!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());