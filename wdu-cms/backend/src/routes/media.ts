import { Router } from 'express';
import prisma from '../prisma';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only images and PDFs are allowed!'));
  }
});

// Get all media
router.get('/', async (req, res) => {
  try {
    const media = await prisma.media.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(media);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch media' });
  }
});

// Create media (Real Multipart Upload)
router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { filename } = req.body;
    const fileUrl = `http://localhost:3001/uploads/${req.file.filename}`;
    
    const media = await prisma.media.create({
      data: { 
        filename: filename || req.file.originalname, 
        url: fileUrl, 
        mimeType: req.file.mimetype, 
        size: req.file.size, 
        uploadedBy: 'Admin' 
      }
    });
    res.status(201).json(media);
  } catch (error: any) {
    console.error('Upload Error:', error);
    res.status(500).json({ error: 'Failed to upload media', details: error.message });
  }
});

// Delete media
router.delete('/:id', async (req, res) => {
  try {
    const media = await prisma.media.findUnique({ where: { id: req.params.id } });
    if (media) {
       const filePath = path.join(__dirname, '..', '..', 'uploads', path.basename(media.url));
       if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
       }
    }
    await prisma.media.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Failed to delete media' });
  }
});

export default router;
