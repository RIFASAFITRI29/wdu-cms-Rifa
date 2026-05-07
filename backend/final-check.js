const { PrismaClient } = require('./prisma/generated/client');
const prisma = new PrismaClient();

async function main() {
  const pages = await prisma.page.count();
  const services = await prisma.service.count();
  const clients = await prisma.partnerLogo.count();
  const messages = await prisma.contactMessage.count();
  const partners = await prisma.experiencePartner.count();

  console.log('--- FINAL DATABASE STATUS ---');
  console.log('Pages:', pages);
  const allPages = await prisma.page.findMany();
  allPages.forEach(p => console.log(`- [Page] ${p.slug} (${p.id})`));

  console.log('Services:', services);
  
  const allServices = await prisma.service.findMany();
  allServices.forEach(s => console.log(`- [Service] ${s.title} (${s.id})`));

  console.log('Clients (Logos):', clients);
  console.log('Messages:', messages);
  console.log('Experience Partners:', partners);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
