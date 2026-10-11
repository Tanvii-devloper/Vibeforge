import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import { initDatabase } from './db.js';
import diagnosticsRouter from './routes/diagnostics.js';
import fieldsRouter from './routes/fields.js';
import advisoriesRouter from './routes/advisories.js';
import analyticsRouter from './routes/analytics.js';
import chatRouter from './routes/chat.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Static uploads directory
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
app.use('/uploads', express.static(uploadDir));

// Sample benchmark images directory
const samplesDir = path.join(__dirname, 'samples');
if (!fs.existsSync(samplesDir)) {
  fs.mkdirSync(samplesDir, { recursive: true });
}
app.use('/samples', express.static(samplesDir));

// API Routes
app.use('/api/diagnostics', diagnosticsRouter);
app.use('/api/fields', fieldsRouter);
app.use('/api/advisories', advisoriesRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/chat', chatRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    system: 'AI-Powered Agriculture Micro-Climatic Crop Disease Early Warning System',
    engine: 'Gemini 2.5 Flash Multimodal + Micro-Climatic Risk Fusion Engine',
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Serve frontend static build in production or when client/dist exists
const clientDistPath = path.join(process.cwd(), 'client', 'dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads') || req.path.startsWith('/samples')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// Global 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'API endpoint not found',
    path: req.originalUrl
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Server Error Handler]:', err.stack || err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error occurred'
  });
});

// Start Server
async function startServer() {
  try {
    await initDatabase();
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`====================================================`);
      console.log(` CropGuard AI Agriculture Early Warning System `);
      console.log(` Server active on port ${PORT}`);
      console.log(` Health check: http://localhost:${PORT}/api/health`);
      console.log(`====================================================`);
    });
  } catch (error) {
    console.error('Fatal error starting server:', error);
    process.exit(1);
  }
}

startServer();

export default app;
