import { Router } from 'express';
import prisma from '../prisma';
import bcrypt from 'bcrypt';
import { authenticate, authorize } from '../middleware/authMiddleware';

const router = Router();

// Apply authentication to all routes
router.use(authenticate);

// UPDATE profile (Accessible by any logged-in user for their own account)
router.patch('/profile', async (req: any, res) => {
  try {
    const userId = req.user.userId;
    const { name, email, avatar, password } = req.body;
    
    const data: any = {};
    if (name) data.name = name;
    if (email) data.email = email;
    if (avatar) data.avatar = avatar;
    if (password) data.passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true
      }
    });
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update profile', details: error.message });
  }
});

// Other routes are restricted to SUPER_ADMIN
router.use(authorize(['SUPER_ADMIN']));

// GET all users
router.get('/', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// CREATE user
router.post('/', async (req, res) => {
  try {
    const { name, email, role, password } = req.body;
    const passwordHash = await bcrypt.hash(password || 'WDU12345!', 12);
    
    const user = await prisma.user.create({
      data: {
        name,
        email,
        role,
        passwordHash
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// UPDATE user
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, password } = req.body;
    
    const data: any = { name, email, role };
    if (password) {
      data.passwordHash = await bcrypt.hash(password, 12);
    }

    const user = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// DELETE user
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.user.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

export default router;
