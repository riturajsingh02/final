import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import apiRouter from './backend/api/index.js';
import { errorHandler } from './backend/utils/errors.js';
import config from './backend/config/env.js';
import { scheduler } from './backend/services/scheduler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Cookie parser middleware
app.use(cookieParser(config.auth.sessionSecret));

// Body parsing middleware with raw body capture for webhook HMAC checks
app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: true }));

// Sitemaps & robots
app.get('/sitemap.xml', (req, res) => {
  res.type('application/xml');
  res.sendFile(path.join(__dirname, 'sitemap.xml'));
});

app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.sendFile(path.join(__dirname, 'robots.txt'));
});

// Direct admin portal route
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

// Mount modular Backend API routes under /api
app.use('/api', apiRouter);

// Serve static frontend assets
app.use(express.static(__dirname));

// Direct page routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Global Error Handler
app.use(errorHandler);

// Listen only when executed directly
if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`The Candlorre server active at http://0.0.0.0:${PORT}`);
    // Start automated scheduler for stock checks, daily reports, and email retries
    scheduler.start();
  });
}

export default app;
