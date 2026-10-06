const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const { getDatabase } = require('./database/db');
const reportsRouter = require('./routes/reports');
const analyzeRouter = require('./routes/analyze');
const statsRouter = require('./routes/stats');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Static uploads folder
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// API Routes
app.use('/api', analyzeRouter);
app.use('/api', reportsRouter);
app.use('/api', statsRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    application: 'CivicLens AI Backend',
    timestamp: new Date().toISOString()
  });
});

// Serve frontend in production build if present
const clientDist = path.join(__dirname, '..', '..', 'client', 'dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api') && !req.path.startsWith('/uploads')) {
      return res.sendFile(path.join(clientDist, 'index.html'));
    }
    next();
  });
}

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message || 'An unexpected error occurred.'
  });
});

// Initialize database and start server
async function startServer() {
  try {
    console.log('Connecting to CivicLens SQLite database...');
    await getDatabase();
    console.log('SQLite database ready.');

    app.listen(PORT, () => {
      console.log(`===============================================`);
      console.log(` CivicLens AI Server running on port ${PORT}`);
      console.log(` Health check: http://localhost:${PORT}/api/health`);
      console.log(` API Endpoints:`);
      console.log(`   - POST  /api/analyze`);
      console.log(`   - GET   /api/reports`);
      console.log(`   - POST  /api/reports`);
      console.log(`   - GET   /api/reports/:id`);
      console.log(`   - PATCH /api/reports/:id/status`);
      console.log(`   - GET   /api/stats`);
      console.log(`   - GET   /api/ai/status`);
      console.log(`===============================================`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
