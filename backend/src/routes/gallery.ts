import { Router } from 'express';
import prisma from '../prisma';

const router = Router();

// Get all gallery images
router.get('/', async (req, res) => {
  try {
    const images = await prisma.documentationGallery.findMany({
      orderBy: { order: 'asc' }
    });
    res.json(images);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch gallery images' });
  }
});

// Add a gallery image
router.post('/', async (req, res) => {
  const { title, url, order } = req.body;
  try {
    const image = await prisma.documentationGallery.create({
      data: { 
        title, 
        url, 
        order: order || 0 
      }
    });
    res.status(201).json(image);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create gallery image' });
  }
});

// Update a gallery image
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const image = await prisma.documentationGallery.update({
      where: { id },
      data: updates
    });
    res.json(image);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update gallery image' });
  }
});

// Delete a gallery image
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.documentationGallery.delete({
      where: { id }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete gallery image' });
  }
});

// Reorder gallery images
router.post('/reorder', async (req, res) => {
  const { items } = req.body; // Expecting [{id: string, order: number}]
  try {
    await prisma.$transaction(
      items.map((item: any) => 
        prisma.documentationGallery.update({
          where: { id: item.id },
          data: { order: item.order }
        })
      )
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reorder gallery images' });
  }
});

export default router;

