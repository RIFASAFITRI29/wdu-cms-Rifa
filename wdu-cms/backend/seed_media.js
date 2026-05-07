const { PrismaClient } = require('./prisma/generated/client');
const prisma = new PrismaClient();

async function main() {
  const defaultMedia = [
    { filename: 'building.jpg', url: 'https://sis.wahanadata.co.id/img/wdu-building.jpg', mimeType: 'image/jpeg', size: 1024500, uploadedBy: 'System' },
    { filename: 'research_data.png', url: 'https://images.unsplash.com/photo-1551288049-bbbda546697a?auto=format&fit=crop&q=80', mimeType: 'image/png', size: 2048000, uploadedBy: 'System' },
    { filename: 'team_meeting.jpg', url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80', mimeType: 'image/jpeg', size: 3072000, uploadedBy: 'System' },
    { filename: 'logo_wdu.png', url: 'https://imd2022.wahanadata.co.id/img/WDU_02.png', mimeType: 'image/png', size: 512000, uploadedBy: 'System' }
  ];

  for (const m of defaultMedia) {
    const exists = await prisma.media.findFirst({ where: { url: m.url } });
    if (!exists) {
      await prisma.media.create({ data: m });
      console.log(`Added ${m.filename}`);
    }
  }
}

main().finally(() => prisma.$disconnect());
