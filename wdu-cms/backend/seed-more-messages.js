const { PrismaClient } = require('./prisma/generated/client');
const prisma = new PrismaClient();

const messages = [
  { name: 'Rifan Ardiansyah', email: 'rifan@example.com', phone: '081234567890', subject: 'Permintaan Penawaran Riset', message: 'Selamat siang, kami tertarik untuk bekerja sama dalam riset tren pasar tahun 2025.', isRead: false },
  { name: 'Dewi Sartika', email: 'dewi.s@corp.id', phone: '082199887766', subject: 'Kerjasama Pelatihan', message: 'Apakah WDU menyediakan pelatihan pengolahan data untuk instansi pemerintah?', isRead: true },
  { name: 'Bambang Pamungkas', email: 'bambang@bola.com', phone: '085544332211', subject: 'Tanya Layanan IoT', message: 'Mohon info detail mengenai implementasi IoT untuk agribisnis.', isRead: false },
  { name: 'Anisa Rahma', email: 'anisa@startup.io', phone: '081122334455', subject: 'Konsultasi Big Data', message: 'Kami butuh bantuan untuk analisis data pengguna di platform kami.', isRead: false },
  { name: 'Eko Prasetyo', email: 'eko@pemerintah.go.id', phone: '087766554433', subject: 'Survei Kepuasan Masyarakat', message: 'Ingin mengajukan kerjasama untuk survei kepuasan layanan publik.', isRead: true },
  { name: 'Maya Indah', email: 'maya@agency.com', phone: '081233445566', subject: 'Analisis Media Digital', message: 'Apakah ada paket khusus untuk monitoring sentimen media sosial?', isRead: false },
  { name: 'Fajar Nugraha', email: 'fajar@univ.ac.id', phone: '081998877665', subject: 'Kerjasama Akademik', message: 'Mengajukan magang untuk mahasiswa statistika di kantor WDU.', isRead: true },
  { name: 'Ratna Sari', email: 'ratna@koperasi.id', phone: '081211223344', subject: 'Sistem Cloud Koperasi', message: 'Tertarik dengan solusi cloud untuk manajemen keuangan koperasi.', isRead: false },
  { name: 'Hendra Wijaya', email: 'hendra@manufaktur.co', phone: '085233445566', subject: 'Machine Learning', message: 'Bagaimana penerapan ML untuk optimasi rantai pasok?', isRead: false },
  { name: 'Siska Putri', email: 'siska@lifestyle.id', phone: '081344556677', subject: 'Riset Gaya Hidup', message: 'Kami butuh data mengenai perilaku belanja online milenial.', isRead: true },
  { name: 'Gunawan', email: 'gun@logistic.com', phone: '081233221100', subject: 'Layanan GIS', message: 'Apakah WDU menyediakan pemetaan GIS untuk rute logistik?', isRead: false },
  { name: 'Tuti Alawiyah', email: 'tuti@yayasan.org', phone: '085677889900', subject: 'Monitoring Evaluasi Proyek', message: 'Butuh bantuan untuk monev program pemberdayaan masyarakat.', isRead: false },
  { name: 'Budi Cahyono', email: 'budi@perbankan.co.id', phone: '081100998877', subject: 'Keamanan Data', message: 'Ingin konsultasi mengenai audit keamanan data nasabah.', isRead: true },
  { name: 'Linda Wahyuni', email: 'linda@retail.com', phone: '081299887766', subject: 'Analisis Prediktif Penjualan', message: 'Bagaimana akurasi prediksi penjualan menggunakan data historis?', isRead: false },
  { name: 'Agus Setiawan', email: 'agus@properti.id', phone: '081344332211', subject: 'Survei Lokasi Strategis', message: 'Mohon bantuan analisis data demografi untuk pengembangan properti baru.', isRead: false }
];

async function main() {
  console.log('Seeding more contact messages...');
  for (const msg of messages) {
    await prisma.contactMessage.create({
      data: {
        ...msg,
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 1000000000)) // Random past dates
      }
    });
  }
  console.log(`Successfully added ${messages.length} messages.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
