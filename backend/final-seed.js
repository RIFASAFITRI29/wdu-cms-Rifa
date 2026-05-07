const { PrismaClient } = require('./prisma/generated/client');
const prisma = new PrismaClient();

const pages = [
  {
    slug: 'home',
    title: 'Beranda',
    content: 'Wahana Data Utama didirikan pada 2006 merupakan perusahaan riset dan survei yang berfokus pada bidang sosial-politik...',
    isPublished: true,
    sections: {
      hero: { title: 'Data Terpadu, Solusi Cerdas | Hasil Maksimal', subtitle: 'Intelligence Data' },
      intro: { title: 'Memiliki pengalaman yang luas serta didukung oleh tim profesional yang kompeten.' }
    }
  },
  {
    slug: 'tentang-kami',
    title: 'Tentang Kami',
    content: 'Wahana Data Utama didirikan pada 2006 merupakan perusahaan riset dan survei yang berfokus pada bidang sosial-politik...',
    isPublished: true
  },
  {
    slug: 'layanan',
    title: 'Layanan Utama',
    content: 'Kami menyediakan berbagai layanan riset dan analisis data...',
    isPublished: true
  },
  {
    slug: 'pengalaman',
    title: 'Pengalaman Kami',
    content: 'Perjalanan panjang kami dalam mengelola data strategis nasional...',
    isPublished: true
  },
  {
    slug: 'kontak',
    title: 'Hubungi Kami',
    content: 'Tim pakar kami siap membantu...',
    phone: '(0251) 755 2099',
    email: 'wahanadata@yahoo.com',
    address: 'Blok AE No. 01, Jl. Terapi Raya, Menteng, Bogor Barat, 16111',
    isPublished: true
  }
];

async function seed() {
  for (const page of pages) {
    await prisma.page.upsert({
      where: { slug: page.slug },
      update: page,
      create: page,
    });
  }
  console.log('Final Sync Selesai!');
}

seed().finally(() => prisma.$disconnect());
