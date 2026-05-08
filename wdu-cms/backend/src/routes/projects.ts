import { Router } from 'express';
import prisma from '../prisma';
import { z } from 'zod';

const router = Router();

const projectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  client: z.string().optional(),
  category: z.string().optional(),
  year: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  isHighlight: z.boolean().optional(),
});

router.get('/', async (req, res) => {
  const projects = await prisma.project.findMany({
    where: req.query.highlight === 'true' ? { isHighlight: true } : undefined,
    orderBy: { order: 'asc' },
  });
  res.json(projects);
});

router.get('/:id', async (req, res) => {
  const project = await prisma.project.findUnique({ where: { id: req.params.id } });
  if (!project) return res.status(404).json({ error: 'Project not found' });
  res.json(project);
});

router.post('/', async (req, res) => {
  const validation = projectSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ error: validation.error.errors[0].message });
  }
  const { title, client, category, year, description, imageUrl, isHighlight } = validation.data;
  const maxOrder = await prisma.project.aggregate({ _max: { order: true } });
  const project = await prisma.project.create({
    data: {
      title, 
      client, 
      category, 
      year: year ? parseInt(year) : undefined, 
      description, 
      imageUrl, 
      isHighlight,
      order: (maxOrder._max.order || 0) + 1,
    },
  });
  res.json(project);
});

router.put('/:id', async (req, res) => {
  const validation = projectSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ error: validation.error.errors[0].message });
  }
  const { title, client, category, year, description, imageUrl, isHighlight } = validation.data;
  const project = await prisma.project.update({
    where: { id: req.params.id },
    data: { 
      title, 
      client, 
      category, 
      year: year ? parseInt(year) : undefined, 
      description, 
      imageUrl, 
      isHighlight 
    },
  });
  res.json(project);
});

router.delete('/:id', async (req, res) => {
  await prisma.project.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});

export default router;