const { PrismaClient } = require('./prisma/generated/client');
const prisma = new PrismaClient();

const pages = [
  {
    slug: 'home',
    title: 'Beranda',
    content: 'Wahana Data Utama didirikan pada 2006 merupakan perusahaan riset dan survei yang berfokus pada bidang sosial-politik, ekonomi, pemasaran, pertanian, dan lainnya. Dengan visi menjadi penyedia data riset global, WDU didukung oleh tim profesional berpengalaman lebih dari 10 tahun. Berkantor di Bogor, kami telah memperoleh kepercayaan dari berbagai instansi pemerintah dan swasta untuk menangani berbagai proyek konsultasi, mulai dari riset hingga event organizing.',
    isPublished: true,
    sections: {
      hero: {
        title: 'Data Terpadu, Solusi Cerdas | Hasil Maksimal',
        subtitle: 'Intelligence Data',
        content: 'Percayakan kebutuhan riset, analisis data, dan teknologi kepada Wahana Data Utama. Kami mengubah data menjadi wawasan berharga dan solusi praktis.',
        wallpaper: 'https://images.openai.com/static-rsc-4/uENIBpNQ9pzuQ7nkbkxvaKaPORZ90tTRfwcR7jdJd0eSpeQLsByLsOEX-jad7rhklyFBWcAjMQ1O2xp7EXNh_3bsngEs83vADK5Z8zAwabamyTl9WYWMtI3PgdASnE6Qc2gA5CmoJmCV5VFtxu60eL4q--jk8Awnk0SlFtB-7lYOHNQv1_76JuueOrerbDED?purpose=fullsize'
      },
      intro: {
        title: 'Memiliki pengalaman yang luas serta didukung oleh tim profesional yang kompeten.',
        content: 'Wahana Data Utama didirikan pada 2006 merupakan perusahaan riset dan survei yang berfokus pada bidang sosial-politik, ekonomi, pemasaran, pertanian, dan lainnya.'
      },
      stats: {
        items: [
          { label: 'Proyek Selesai', value: '500+' },
          { label: 'Klien Puas', value: '200+' },
          { label: 'Efisiensi Data', value: '98%' },
          { label: 'Dukungan', value: '24/7' }
        ]
      },
      services: {
        title: 'Layanan Kami',
        content: 'berkomitmen untuk membantu bisnis dan organisasi Anda mengelola, menganalisis, dan memanfaatkan data secara optimal.'
      },
      trust: {
        title: 'Kepercayaan klien terhadap kami',
        content: 'Dengan pengalaman selama 18 tahun, kami membangun kolaborasi strategis untuk organisasi pemerintah dan juga sektor swasta.'
      }
    },
    metaTitle: 'Wahana Data Utama - Intelligence Data Solutions',
    metaDesc: 'Mitra terpercaya untuk riset dan analisis data strategis di Indonesia.'
  },
  {
    slug: 'about',
    title: 'Tentang Kami',
    content: 'Wahana Data Utama didirikan pada 2006 merupakan perusahaan riset dan survei yang berfokus pada bidang sosial-politik. Dengan pengalaman lebih dari 15 tahun, kami berkomitmen untuk memberikan solusi data intelijen yang akurat dan terpercaya.',
    isPublished: true,
    metaTitle: 'Tentang Kami - Wahana Data Utama',
    metaDesc: 'Pelajari lebih lanjut mengenai perjalanan dan visi Wahana Data Utama.'
  },
  {
    slug: 'services',
    title: 'Layanan Utama',
    content: 'Kami menyediakan berbagai layanan riset dan analisis data tingkat lanjut untuk membantu transformasi digital Anda. Mulai dari survei opini publik hingga analisis big data, kami hadir untuk mendukung pengambilan keputusan strategis Anda.',
    isPublished: true,
    metaTitle: 'Layanan Kami - Wahana Data Utama'
  },
  {
    slug: 'experience',
    title: 'Pengalaman Kami',
    content: 'Perjalanan panjang kami dalam mengelola data strategis nasional telah membuktikan kapabilitas kami sebagai mitra intelijen data terdepan di Indonesia. Kami telah berkolaborasi dengan berbagai kementerian, lembaga pemerintah, dan sektor swasta.',
    isPublished: true,
    metaTitle: 'Pengalaman & Jejak - Wahana Data Utama'
  },
  {
    slug: 'contact',
    title: 'Hubungi Kami',
    content: 'Tim pakar kami siap membantu merancang solusi berbasis data yang tepat untuk organisasi Anda.',
    phone: '(0251) 755 2099',
    email: 'wahanadata@yahoo.com',
    address: 'Blok AE No. 01, Jl. Terapi Raya, Menteng, Bogor Barat, 16111',
    mapsUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.4735398285516!2d106.772594!3d-6.587948299999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69c450f7f2b963%3A0x6d9f9f9f9f9f9f9f!2sJl.%20Terapi%20Raya%2C%20Menteng%2C%20Kec.%20Bogor%20Bar.%2C%20Kota%20Bogor%2C%20Jawa%20Barat%2016111!5e0!3m2!1sen!2sid!4v1710000000000!5m2!1sen!2sid',
    isPublished: true,
    metaTitle: 'Hubungi Kami - Wahana Data Utama'
  }
];

async function seed() {
  console.log('Sinkronisasi konten mendalam sedang berlangsung...');
  
  for (const page of pages) {
    await prisma.page.upsert({
      where: { slug: page.slug },
      update: page,
      create: page,
    });
    console.log(`Berhasil menyinkronkan: ${page.slug}`);
  }
  
  console.log('Selesai! Sekarang semua halaman sudah "Plek Ketiplek" dan bisa diedit.');
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
