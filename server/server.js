require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const connectDB = require('./config/db');
const Admin = require('./models/Admin');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// ── Security headers ─────────────────────────────────────────────
app.use(
  helmet({
    // Allow images/PDFs served from /uploads to be embedded by the React app
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false, // API only; CSP is managed by the client host
  })
);

// ── CORS: allow the portfolio origin(s) from env, plus same-origin/no-origin tools ──
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:3000')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app') ||
          origin.endsWith('.render.com') || origin.endsWith('.e2b.app')) {
        return callback(null, true);
      }
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

// ── Parsers & utilities ──────────────────────────────────────────
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(compression());
if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));

// ── Static uploads (local storage fallback) ──────────────────────
app.use(
  '/uploads',
  express.static(path.join(__dirname, 'uploads'), {
    maxAge: '7d',
    immutable: true,
  })
);

// ── API routes ───────────────────────────────────────────────────
app.get('/api/health', (req, res) =>
  res.json({ success: true, status: 'ok', service: 'portfolio-api', time: new Date().toISOString() })
);
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/profile', require('./routes/profileRoutes'));
app.use('/api/skills', require('./routes/crudRoutes')(require('./models/Skill'), { label: 'Skill' }));
app.use('/api/experience', require('./routes/crudRoutes')(require('./models/Experience'), { label: 'Experience' }));
app.use('/api/projects', require('./routes/crudRoutes')(require('./models/Project'), { label: 'Project' }));
app.use('/api/education', require('./routes/crudRoutes')(require('./models/Education'), { label: 'Education' }));
app.use('/api/certifications', require('./routes/crudRoutes')(require('./models/Certification'), { label: 'Certification' }));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/settings', require('./routes/settingsRoutes'));
app.use('/api/resume', require('./routes/resumeRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/overview', require('./routes/overviewRoutes'));

app.use(notFound);
app.use(errorHandler);

// ── Start ────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

const ensureAdmin = async () => {
  // First-boot convenience: create the admin from env (hashed with bcrypt).
  const count = await Admin.countDocuments();
  if (count > 0) return;
  const email = (process.env.ADMIN_EMAIL || 'admin@soumik.dev').toLowerCase();
  const password = process.env.ADMIN_PASSWORD || 'Admin@12345';
  await Admin.create({ name: 'Soumik Adhikary', email, password, role: 'admin' });
  console.log(`✓ Initial admin created: ${email} (change this password after first login)`);
};

const start = async () => {
  try {
    await connectDB();
    await ensureAdmin();
    app.listen(PORT, () => {
      console.log(`✓ API server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('✗ Failed to start server:', err.message);
    process.exit(1);
  }
};

start();

module.exports = app;
