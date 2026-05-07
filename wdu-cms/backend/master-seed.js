const { PrismaClient } = require('./prisma/generated/client');
const prisma = new PrismaClient();

const masterData = [
  {
    slug: 'home',
    title: 'Beranda',
    content: 'Wahana Data Utama didirikan pada 2006 merupakan perusahaan riset dan survei yang berfokus pada bidang sosial-politik, ekonomi, pemasaran, pertanian, dan lainnya. Dengan visi menjadi penyedia data riset global, WDU didukung oleh tim profesional berpengalaman lebih dari 10 tahun. Berkantor di Bogor, kami telah memperoleh kepercayaan dari berbagai instansi pemerintah dan swasta untuk menangani berbagai proyek konsultasi, mulai dari riset hingga event organizing.',
    isPublished: true,
    sections: {
      hero: {
        title: 'Data Terpadu, Solusi Cerdas | Hasil Maksimal',
        subtitle: 'Intelligence Data',
        content: 'Percayakan kebutuhan riset, analisis data, dan teknologi kepada Wahana Data Utama. Kami mengubah data menjadi wawasan berharga dan solusi praktis yang membantu Anda meraih keunggulan kompetitif di era digital.',
        wallpaper: 'https://images.openai.com/static-rsc-4/uENIBpNQ9pzuQ7nkbkxvaKaPORZ90tTRfwcR7jdJd0eSpeQLsByLsOEX-jad7rhklyFBWcAjMQ1O2xp7EXNh_3bsngEs83vADK5Z8zAwabamyTl9WYWMtI3PgdASnE6Qc2gA5CmoJmCV5VFtxu60eL4q--jk8Awnk0SlFtB-7lYOHNQv1_76JuueOrerbDED?purpose=fullsize'
      },
      intro: {
        title: 'Memiliki pengalaman yang luas serta didukung oleh tim profesional yang kompeten.',
        content: 'Wahana Data Utama didirikan pada 2006 merupakan perusahaan riset dan survei yang berfokus pada bidang sosial-politik, ekonomi, pemasaran, pertanian, dan lainnya.'
      }
    }
  },
  {
    slug: 'tentang-kami',
    title: 'TENTANG KAMI',
    content: 'Wahana Data Utama didirikan pada tahun 2006, telah tumbuh menjadi perusahaan terkemuka dalam penyediaan layanan riset dan data di Indonesia dengan visi “Data Is Our Business” kami berkomitmen untuk menjadi pelopor dalam solusi data berbasis penelitian dengan memanfaatkan teknologi terkini, seperti analitik big data, pelaksanaan survei, dan Internet of Things (IoT), guna memberikan layanan yang relevan dan berdaya saing global di era revolusi Industri 5.0.\n\nBerkantor di Graha Nurul Menteng, Bogor, kami mengintegrasikan inovasi digital dalam riset sosial-politik, lingkungan hidup, ekonomi pembangunan, hingga manajemen pemasaran, serta menawarkan solusi berbasis cloud yang cepat dan akurat untuk berbagai kebutuhan, termasuk koperasi dan UKM, agribisnis, serta periklanan digital. Melalui penerapan teknologi mutakhir seperti machine learning untuk analisis prediktif, kami mendukung klien dalam menghadapi tantangan bisnis modern dan menciptakan keunggulan kompetitif yang berkelanjutan.\n\nDidirikan oleh para profesional berpengalaman dengan spesialisasi lebih dari satu dekade, kami membangun fondasi perusahaan yang kokoh dalam setiap aspek operasional, mulai dari perencanaan, pelaksanaan, pengawasan, hingga evaluasi, dengan pendekatan metodologi berbasis teknologi modern. Tenaga ahli kami yang terlatih dan bersertifikasi terus meningkatkan kompetensi melalui pendidikan dan pelatihan berbasis digital, termasuk riset dan penggunaan software analitik canggih.\n\nSebagai mitra strategis bagi instansi pemerintah maupun swasta, kami telah membuktikan kapabilitas dengan menyelesaikan berbagai proyek konsultasi yang kompleks dan multidimensi, mencakup riset tren pasar global, pelatihan profesional berbasis teknologi, hingga event organizing yang didukung platform digital.\n\nDengan integrasi solusi berkelanjutan untuk menghadapi tantangan global, transformasi digital, dan ketahanan ekonomi, kami memanfaatkan data sebagai aset strategis untuk mendukung pembangunan nasional dan internasional. Di tahun 2025, kami terus berkomitmen untuk menjadi mitra terpercaya yang menghadirkan inovasi dan perubahan signifikan dalam ekosistem data-driven yang berorientasi pada masa depan.',
    isPublished: true
  },
  {
    slug: 'layanan',
    title: 'LAYANAN KAMI',
    content: 'Hadirkan transformasi nyata untuk bisnis Anda melalui rangkaian solusi cerdas berbasis data, teknologi mutakhir, dan analitik mendalam. Kami berdedikasi untuk membantu Anda mencapai efisiensi dan potensi maksimal.\n\nJelajahi beragam solusi terbaik dengan menggunakan layanan kami!\n\nKami dengan senang hati siap membantu memenuhi kebutuhan Anda melalui layanan terbaik yang kami sediakan. Jangan ragu untuk mengandalkan kami dalam memberikan solusi yang tepat untuk Anda!',
    isPublished: true
  },
  {
    slug: 'pengalaman',
    title: 'PENGALAMAN KAMI',
    content: 'Sejak didirikan pada tahun 2006, Wahana Data Utama telah mengukir perjalanan panjang sebagai penyedia layanan riset dan data terdepan di Indonesia. Pengalaman kami dalam memanfaatkan teknologi terkini seperti big data analytics, survei, dan Internet of Things (IoT) memungkinkan kami untuk memberikan solusi yang relevan dan inovatif di berbagai sektor. Kami telah berkolaborasi dengan berbagai industries, mulai dari koperasi dan UKM, agribisnis, hingga periklanan digital, untuk menghadirkan layanan berbasis cloud yang cepat dan akurat. Pengalaman kami juga mencakup penerapan machine learning dalam analisis prediktif, membantu klien menghadapi tantangan bisnis yang terus berkembang. Dengan pengalaman luas di bidang riset sosial-politik, ekonomi pembangunan, dan manajemen pemasaran, kami terus berkomitmen untuk mendukung klien dalam menciptakan keunggulan kompetitif yang berkelanjutan di era Revolusi Industri 5.0.\n\nDengan komitmen yang kuat terhadap inovasi dan keakuratan data, Wahana Data Utama siap menjadi mitra terpercaya bagi bisnis dan organisasi dalam mengambil keputusan berbasis informasi. Di era digital yang semakin kompleks, kami terus berinovasi dengan teknologi terkini untuk menghadirkan solusi yang relevan, akurat, dan berdampak nyata.\n\nKepercayaan klien adalah prioritas utama kami, dan dengan pengalaman bertahun-tahun serta tim profesional yang andal, kami berkomitmen untuk membantu berbagai sektor mengoptimalkan strategi bisnis mereka.\n\nBersama Wahana Data Utama, Anda tidak hanya mendapatkan data, tetapi juga wawasan strategis yang mendorong pertumbuhan dan kesuksesan jangka panjang. Mari melangkah ke masa depan dengan strategi yang lebih cerdas, efisien, dan berdaya saing tinggi!',
    isPublished: true
  },
  {
    slug: 'kontak',
    title: 'HUBUNGI KAMI',
    content: 'Dapatkan segala informasi dengan menghubungi kami! Kami siap membantu navigasi data anda.\n\nIsi formulir di bawah ini dan tim ahli kami akan segera menghubungi Anda dalam waktu 24 jam kerja.\n\nData Anda tersimpan dengan aman sesuai kebijakan privasi kami.',
    phone: '(0251) 755 2099',
    email: 'wahanadata@yahoo.com',
    address: 'Blok AE No. 01, Jl. Terapi Raya, Menteng, Bogor Barat, 16111',
    mapsUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.4735398285516!2d106.772594!3d-6.587948299999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69c450f7f2b963%3A0x6d9f9f9f9f9f9f9f!2sJl.%20Terapi%20Raya%2C%20Menteng%2C%20Kec.%20Bogor%20Bar.%2C%20Kota%20Bogor%2C%20Jawa%20Barat%2016111!5e0!3m2!1sen!2sid!4v1710000000000!5m2!1sen!2sid',
    isPublished: true
  }
];

async function seed() {
  console.log('Memulai Sinkronisasi Teks Asli Premium...');
  for (const page of masterData) {
    await prisma.page.upsert({
      where: { slug: page.slug },
      update: page,
      create: page
    });
    console.log(`- Berhasil mengembalikan teks asli: ${page.slug}`);
  }
  console.log('Selesai! Sekarang semua halaman kembali ke tampilan premium Anda.');
}

seed().finally(() => prisma.$disconnect());
