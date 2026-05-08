import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import path from 'path';
import fs from 'fs';
import prisma from './prisma';
import authRoutes from './routes/auth';
import pageRoutes from './routes/pages';
import serviceRoutes from './routes/services';
import projectRoutes from './routes/projects';
import contactRoutes from './routes/contact';
import configRoutes from './routes/config';
import mediaRoutes from './routes/media';
import clientRoutes from './routes/clients';
import galleryRoutes from './routes/gallery';
import experiencePartnerRoutes from './routes/experiencePartners';
import userRoutes from './routes/users';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// 1. Security Headers
app.use(helmet({
  crossOriginResourcePolicy: false, // Allow cross-origin images
}));

// 2. Strict CORS
const allowedOrigins = ['http://localhost:3000', 'http://localhost:5173']; // Local dev ports
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// 3. Cookie Parser
app.use(cookieParser());

// 4. Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per 15 minutes
  message: { error: 'Too many requests from this IP, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per 15 minutes for security
  message: { error: 'Too many login attempts, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(morgan('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Static files
app.use('/uploads', express.static(uploadsDir));

// 5. Apply Limiting
app.use('/api/v1', apiLimiter); // Apply global limiter to all v1 endpoints
// app.use('/api/v1/auth/login', loginLimiter); // Disabled temporarily for user testing
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/pages', pageRoutes);
app.use('/api/v1/services', serviceRoutes);
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/contact', contactRoutes);
app.use('/api/v1/config', configRoutes);
app.use('/api/v1/media', mediaRoutes);
app.use('/api/v1/clients', clientRoutes);
app.use('/api/v1/gallery', galleryRoutes);
app.use('/api/v1/experience-partners', experiencePartnerRoutes);
app.use('/api/v1/users', userRoutes);

app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('GLOBAL ERROR:', err.stack);
  res.status(500).json({ 
    error: 'Internal Server Error', 
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}/api/v1`);
});

export { app, prisma };