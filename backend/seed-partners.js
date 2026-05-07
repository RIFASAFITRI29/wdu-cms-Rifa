const { PrismaClient } = require('./prisma/generated/client');
const prisma = new PrismaClient();

const partners = [
  // 2024
  { year: "2024", category: "Public Sector & Gov", logoUrl: "https://wahanadata.co.id/wp-content/uploads/2025/01/bpk-150x150.png" },
  { year: "2024", category: "Public Sector & Gov", logoUrl: "https://wahanadata.co.id/wp-content/uploads/2025/01/bpom-1-768x524.png" },
  { year: "2024", category: "Public Sector & Gov", logoUrl: "https://wahanadata.co.id/wp-content/uploads/2025/01/bkpm-1-768x524.png" },
  { year: "2024", category: "Public Sector & Gov", logoUrl: "https://wahanadata.co.id/wp-content/uploads/2025/01/Kominfo-e1737704377593.png" },
  { year: "2024", category: "Public Sector & Gov", logoUrl: "https://wahanadata.co.id/wp-content/uploads/2025/01/paljaya-768x768.png" },
  
  // 2023
  { year: "2023", category: "Strategic Partnerships", logoUrl: "https://wahanadata.co.id/wp-content/uploads/2025/01/paljaya-300x300.png" },
  { year: "2023", category: "Strategic Partnerships", logoUrl: "https://wahanadata.co.id/wp-content/uploads/2025/01/kominfo-old-square-300x300.png" },
  { year: "2023", category: "Strategic Partnerships", logoUrl: "https://wahanadata.co.id/wp-content/uploads/2025/01/bpk-square-300x300.png" },
  { year: "2023", category: "Strategic Partnerships", logoUrl: "https://wahanadata.co.id/wp-content/uploads/2025/01/stm-yogya-square-300x300.png" },
  
  // 2022
  { year: "2022", category: "National Projects", logoUrl: "https://wahanadata.co.id/wp-content/uploads/2025/01/bumn-square-300x300.png" },
  { year: "2022", category: "National Projects", logoUrl: "https://wahanadata.co.id/wp-content/uploads/2025/01/jakarta-square-300x300.png" },
  { year: "2022", category: "National Projects", logoUrl: "https://wahanadata.co.id/wp-content/uploads/2025/01/kpk-square-300x300.png" }
];

async function seed() {
  console.log('Seeding experience partners...');
  for (const partner of partners) {
    await prisma.experiencePartner.create({ data: partner });
  }
  console.log('Seed success!');
}

seed().finally(() => prisma.$disconnect());
