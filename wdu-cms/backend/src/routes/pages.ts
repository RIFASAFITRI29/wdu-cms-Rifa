import { Router } from 'express';
import prisma from '../prisma';
import { z } from 'zod';

const router = Router();

const pageSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDesc: z.string().optional(),
  sections: z.any().optional(),
  isPublished: z.boolean().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  address: z.string().optional(),
  mapsUrl: z.string().optional(),
});

router.get('/', async (req, res) => {
  const pages = await prisma.page.findMany({ orderBy: { updatedAt: 'desc' } });
  res.json(pages);
});

router.get('/:slug', async (req, res) => {
  const page = await prisma.page.findUnique({ where: { slug: req.params.slug } });
  if (!page) return res.status(404).json({ error: 'Page not found' });
  res.json(page);
});

router.put('/:slug', async (req, res) => {
  const validation = pageSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ error: validation.error.errors[0].message });
  }
  const { title, content, metaTitle, metaDesc, sections, isPublished, phone, email, address, mapsUrl } = validation.data;
  const page = await prisma.page.update({
    where: { slug: req.params.slug },
    data: { title, content, metaTitle, metaDesc, sections, isPublished, phone, email, address, mapsUrl },
  });
  res.json(page);
});

router.post('/', async (req, res) => {
  const validation = pageSchema.extend({ slug: z.string().min(1) }).safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ error: validation.error.errors[0].message });
  }
  const { title, slug, content, sections, isPublished, phone, email, address, mapsUrl } = validation.data;
  try {
    const page = await prisma.page.create({
      data: { 
        title, 
        slug, 
        content: content || '',
        sections: sections || {}, 
        isPublished: isPublished || false,
        phone,
        email,
        address,
        mapsUrl
      },
    });
    res.status(201).json(page);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create page. Slug might already exist.' });
  }
});

router.delete('/:slug', async (req, res) => {
  try {
    await prisma.page.delete({ where: { slug: req.params.slug } });
    res.json({ success: true });
  } catch (error) {
    res.status(404).json({ error: 'Page not found' });
  }
});

router.patch('/:slug/publish', async (req, res) => {
  const { isPublished } = req.body;
  const page = await prisma.page.update({
    where: { slug: req.params.slug },
    data: { isPublished },
  });
  res.json(page);
});

export default router;