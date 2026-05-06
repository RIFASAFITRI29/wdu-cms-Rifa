const { PrismaClient } = require('./prisma/generated/client');
const prisma = new PrismaClient();

const partners = [
  // 2021
  { year: "2021", category: "Regulatory & Compliance", logoUrl: "https://wahanadata.co.id/wp-content/uploads/2025/01/bpom-square-300x300.png" },
  { year: "2021", category: "Regulatory & Compliance", logoUrl: "https://wahanadata.co.id/wp-content/uploads/2025/01/bpk-square-300x300.png" },
  { year: "2021", category: "Regulatory & Compliance", logoUrl: "https://wahanadata.co.id/wp-content/uploads/2025/01/kpk-square-300x300.png" },
  { year: "2021", category: "Regulatory & Compliance", logoUrl: "https://wahanadata.co.id/wp-content/uploads/2025/01/kemendes-square-300x300.png" },
  { year: "2021", category: "Regulatory & Compliance", logoUrl: "https://wahanadata.co.id/wp-content/uploads/2025/01/pakuan-jaya-square-300x300.png" },
  { year: "2021", category: "Regulatory & Compliance", logoUrl: "https://wahanadata.co.id/wp-content/uploads/2025/01/bkpm-square-300x300.png" },
  { year: "2021", category: "Regulatory & Compliance", logoUrl: "https://wahanadata.co.id/wp-content/uploads/2025/01/kominfo-old-square-300x300.png" },
  
  // 2020
  { year: "2020", category: "Regional Impact", logoUrl: "https://wahanadata.co.id/wp-content/uploads/2025/01/bpk-square-300x300.png" },
  { year: "2020", category: "Regional Impact", logoUrl: "https://wahanadata.co.id/wp-content/uploads/2025/01/kemendes-square-300x300.png" }
];

async function seed() {
  console.log('Menambahkan data pengalaman 2021 & 2020...');
  for (const partner of partners) {
    // Check if already exists to avoid duplicates if run multiple times
    const exists = await prisma.experiencePartner.findFirst({
      where: { year: partner.year, logoUrl: partner.logoUrl }
    });
    
    if (!exists) {
      await prisma.experiencePartner.create({ data: partner });
    }
  }
  console.log('Berhasil menambahkan data 2021 & 2020!');
}

seed().finally(() => prisma.$disconnect());
