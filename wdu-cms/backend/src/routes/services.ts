import { Router } from 'express';
import prisma from '../prisma';
import { z } from 'zod';

const router = Router();

const serviceSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  icon: z.string().optional(),
  isActive: z.boolean().optional(),
});

const reorderSchema = z.object({
  orders: z.array(z.object({
    id: z.string(),
    order: z.number()
  }))
});

router.get('/', async (req, res) => {
  const services = await prisma.service.findMany({
    where: req.query.active === 'true' ? { isActive: true } : undefined,
    orderBy: { order: 'asc' },
  });
  res.json(services);
});

router.get('/:id', async (req, res) => {
  const service = await prisma.service.findUnique({ where: { id: req.params.id } });
  if (!service) return res.status(404).json({ error: 'Service not found' });
  res.json(service);
});

router.post('/', async (req, res) => {
  const validation = serviceSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ error: validation.error.errors[0].message });
  }
  const { title, description, icon } = validation.data;
  const maxOrder = await prisma.service.aggregate({ _max: { order: true } });
  const service = await prisma.service.create({
    data: { 
      title, 
      description: description || '', 
      icon: icon || null, 
      order: (maxOrder._max.order || 0) + 1 
    },
  });
  res.json(service);
});

router.put('/:id', async (req, res) => {
  const validation = serviceSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ error: validation.error.errors[0].message });
  }
  const { title, description, icon, isActive } = validation.data;
  const service = await prisma.service.update({
    where: { id: req.params.id },
    data: { 
      title, 
      description: description || '', 
      icon: icon || null, 
      isActive 
    },
  });
  res.json(service);
});

router.delete('/:id', async (req, res) => {
  await prisma.service.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});

router.patch('/reorder', async (req, res) => {
  const validation = reorderSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ error: validation.error.errors[0].message });
  }
  const { orders } = validation.data;
  await Promise.all(
    orders.map((item: { id: string; order: number }) =>
      prisma.service.update({ where: { id: item.id }, data: { order: item.order } })
    )
  );
  res.json({ success: true });
});

export default router;