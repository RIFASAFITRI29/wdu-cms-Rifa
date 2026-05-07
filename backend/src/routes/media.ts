import { Router } from 'express';
import prisma from '../prisma';

const router = Router();

// Get all media
router.get('/', async (req, res) => {
  try {
    const media = await prisma.media.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(media);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch media' });
  }
});

// Create media (simulated upload for now)
router.post('/', async (req, res) => {
  try {
    const { filename, url, mimeType, size, uploadedBy } = req.body;
    const media = await prisma.media.create({
      data: { filename, url, mimeType, size, uploadedBy: uploadedBy || 'Admin' }
    });
    res.status(201).json(media);
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload media' });
  }
});

// Delete media
router.delete('/:id', async (req, res) => {
  try {
    await prisma.media.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete media' });
  }
});

export default router;
