import { Router } from 'express';
import prisma from '../prisma';

const router = Router();

// Get all clients
router.get('/', async (req, res) => {
  try {
    const clients = await prisma.partnerLogo.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch clients' });
  }
});

// Add a client
router.post('/', async (req, res) => {
  const { name, url } = req.body;
  try {
    const client = await prisma.partnerLogo.create({
      data: { name, url }
    });
    res.status(201).json(client);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create client' });
  }
});

// Delete a client
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.partnerLogo.delete({
      where: { id }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete client' });
  }
});

export default router;
