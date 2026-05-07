import { Router } from 'express';
import prisma from '../prisma';

const router = Router();

// Get all partners
router.get('/', async (req, res) => {
  try {
    const partners = await prisma.experiencePartner.findMany({
      orderBy: [
        { year: 'desc' },
        { order: 'asc' }
      ]
    });
    res.json(partners);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch partners' });
  }
});

// Create partner
router.post('/', async (req, res) => {
  const { year, category, logoUrl, order } = req.body;
  try {
    const partner = await prisma.experiencePartner.create({
      data: {
        year,
        category,
        logoUrl,
        order: order || 0
      }
    });
    res.status(201).json(partner);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create partner' });
  }
});

// Update partner
router.put('/:id', async (req, res) => {
  const { year, category, logoUrl, order } = req.body;
  try {
    const partner = await prisma.experiencePartner.update({
      where: { id: req.params.id },
      data: { year, category, logoUrl, order }
    });
    res.json(partner);
  } catch (error) {
    res.status(404).json({ error: 'Partner not found' });
  }
});

// Delete partner
router.delete('/:id', async (req, res) => {
  try {
    await prisma.experiencePartner.delete({
      where: { id: req.params.id }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(404).json({ error: 'Partner not found' });
  }
});

export default router;
