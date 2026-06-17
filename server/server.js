require('dotenv').config();
require('express-async-errors');

const express = require('express');
const cors = require('cors');
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

// ── Security middleware ─────────────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

// ── Rate limiting ────────────────────────────────────────────────
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
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
  res.json({ success: true, message: 'PIM API is running', env: process.env.NODE_ENV });
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

// ── 404 handler ──────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// ── Global error handler ─────────────────────────────────────────
app.use(errorHandler);

// ── Start server ─────────────────────────────────────────────────
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`\n🚀 PIM Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`📡 API: http://localhost:${PORT}/api/health\n`);
});
