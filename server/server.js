require('dotenv').config();
require('express-async-errors');

const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// ── Route imports ──────────────────────────────────────────────
const authRoutes       = require('./routes/auth.routes');
const noticeRoutes     = require('./routes/notices.routes');
const slideRoutes      = require('./routes/slides.routes');
const courseRoutes     = require('./routes/courses.routes');
const universityRoutes = require('./routes/universities.routes');
const centerRoutes     = require('./routes/centers.routes');
const galleryRoutes    = require('./routes/gallery.routes');
const enquiryRoutes    = require('./routes/enquiries.routes');
const userRoutes       = require('./routes/users.routes');
const settingsRoutes   = require('./routes/settings.routes');

const app = express();

// ── Connect MongoDB ─────────────────────────────────────────────
connectDB();

// ── ALLOWED ORIGINS ────────────────────────────────────────────
const ALLOWED = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://saraswatieducation.info',
  'https://www.saraswatieducation.info',
  'https://scec-websites.vercel.app',
  'https://www.scec-websites.vercel.app',
  process.env.CLIENT_URL,
].filter(Boolean);

console.log('✅ Allowed CORS origins:', ALLOWED);

// ── CORS preflight — must be FIRST before everything ───────────
app.options('*', (req, res) => {
  const origin = req.headers.origin;
  if (ALLOWED.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Vary', 'Origin');
  res.sendStatus(204);
});

// ── CORS headers on every request ──────────────────────────────
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (ALLOWED.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    res.setHeader('Vary', 'Origin');
  }
  next();
});

// ── Security ────────────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  crossOriginOpenerPolicy: false,
}));

// ── Rate limiting ────────────────────────────────────────────────
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many login attempts, please try again in 15 minutes.' },
});

app.use(generalLimiter);

// ── Body parsers ─────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// ── Logger ───────────────────────────────────────────────────────
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ── Health check ─────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'SCEC API is running',
    env: process.env.NODE_ENV,
    allowedOrigins: ALLOWED,
  });
});

// ── Routes ───────────────────────────────────────────────────────
app.use('/api/auth',         authLimiter, authRoutes);
app.use('/api/notices',      noticeRoutes);
app.use('/api/slides',       slideRoutes);
app.use('/api/courses',      courseRoutes);
app.use('/api/universities', universityRoutes);
app.use('/api/centers',      centerRoutes);
app.use('/api/gallery',      galleryRoutes);
app.use('/api/enquiries',    enquiryRoutes);
app.use('/api/users',        userRoutes);
app.use('/api/settings',     settingsRoutes);

// ── 404 ──────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// ── Global error handler ─────────────────────────────────────────
app.use(errorHandler);

// ── Start ────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 SCEC Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`📡 Health: http://localhost:${PORT}/api/health\n`);
});
