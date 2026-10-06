const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { getDatabase } = require('../database/db');
const { analyzeImage } = require('../services/aiService');

const router = express.Router();

// Configure multer file upload to save directly into uploads/
const uploadsDir = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    const uniqueName = `civic-${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: diskStorage,
  limits: { fileSize: 10 * 1024 * 1024 }
});

const VALID_STATUSES = ['Pending', 'Under Review', 'In Progress', 'Resolved'];

/**
 * GET /api/reports
 * Returns list of reports with optional filtering & sorting
 */
router.get('/reports', async (req, res) => {
  try {
    const db = await getDatabase();
    let reports = db.all('SELECT * FROM reports ORDER BY datetime(createdAt) DESC');

    const { issueType, severity, status, search, sortBy } = req.query;

    // Filter by issueType
    if (issueType && issueType.toLowerCase() !== 'all') {
      reports = reports.filter(r => r.issueType && r.issueType.toLowerCase() === issueType.toLowerCase());
    }

    // Filter by severity
    if (severity && severity.toLowerCase() !== 'all') {
      reports = reports.filter(r => r.severity && r.severity.toLowerCase() === severity.toLowerCase());
    }

    // Filter by status
    if (status && status.toLowerCase() !== 'all') {
      reports = reports.filter(r => r.status && r.status.toLowerCase() === status.toLowerCase());
    }

    // Keyword search
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      reports = reports.filter(r =>
        (r.location && r.location.toLowerCase().includes(q)) ||
        (r.description && r.description.toLowerCase().includes(q)) ||
        (r.explanation && r.explanation.toLowerCase().includes(q)) ||
        (r.issueType && r.issueType.toLowerCase().includes(q)) ||
        (r.id && r.id.toLowerCase().includes(q))
      );
    }

    // Sorting
    const severityRank = { Critical: 4, High: 3, Medium: 2, Low: 1 };

    if (sortBy === 'severity') {
      reports.sort((a, b) => (severityRank[b.severity] || 0) - (severityRank[a.severity] || 0));
    } else if (sortBy === 'confidence') {
      reports.sort((a, b) => (b.confidence || 0) - (a.confidence || 0));
    } else if (sortBy === 'oldest') {
      reports.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else {
      // Default: newest first
      reports.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    res.json({
      total: reports.length,
      reports
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ error: 'Failed to retrieve reports', details: error.message });
  }
});

/**
 * GET /api/reports/:id
 * Retrieve a single report by ID
 */
router.get('/reports/:id', async (req, res) => {
  try {
    const db = await getDatabase();
    const report = db.get('SELECT * FROM reports WHERE id = ?', [req.params.id]);

    if (!report) {
      return res.status(404).json({ error: `Report with ID '${req.params.id}' not found.` });
    }

    res.json(report);
  } catch (error) {
    console.error('Error fetching report:', error);
    res.status(500).json({ error: 'Failed to fetch report details', details: error.message });
  }
});

/**
 * POST /api/reports
 * Creates a new infrastructure report
 */
router.post('/reports', upload.single('imageFile'), async (req, res) => {
  try {
    const db = await getDatabase();

    let image = req.body.image || '';
    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    }

    if (!image) {
      return res.status(400).json({ error: 'Image is required for submitting an infrastructure report.' });
    }

    let {
      issueType,
      severity,
      confidence,
      explanation,
      recommendedAction,
      location,
      description,
      status
    } = req.body;

    // If AI analysis was not yet performed on client, run it automatically
    if (!issueType || !severity || !explanation) {
      let imageBuffer = null;
      let mimeType = 'image/jpeg';

      if (req.file) {
        imageBuffer = fs.readFileSync(path.join(uploadsDir, req.file.filename));
        mimeType = req.file.mimetype;
      } else if (image.startsWith('data:')) {
        const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (matches) {
          mimeType = matches[1];
          imageBuffer = Buffer.from(matches[2], 'base64');
        }
      }

      if (imageBuffer) {
        const aiResult = await analyzeImage({
          imageBuffer,
          mimeType,
          description: description || '',
          filename: req.file ? req.file.originalname : 'upload.jpg'
        });
        issueType = issueType || aiResult.issueType;
        severity = severity || aiResult.severity;
        confidence = confidence || aiResult.confidence;
        explanation = explanation || aiResult.explanation;
        recommendedAction = recommendedAction || aiResult.recommendedAction;
      }
    }

    // Normalize values
    const id = `REP-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();
    const finalStatus = VALID_STATUSES.includes(status) ? status : 'Pending';
    const finalConfidence = typeof confidence === 'number' ? confidence : parseFloat(confidence) || 0.90;

    const newReport = {
      id,
      image,
      issueType: issueType || 'Other Infrastructure Issue',
      severity: severity || 'Medium',
      confidence: finalConfidence,
      explanation: explanation || 'Visual defect detected on public infrastructure.',
      recommendedAction: recommendedAction || 'Inspect and schedule municipal repair.',
      location: location && location.trim() ? location.trim() : 'Location not specified',
      description: description && description.trim() ? description.trim() : 'No additional description provided.',
      status: finalStatus,
      createdAt: now,
      updatedAt: now
    };

    db.run(
      `INSERT INTO reports (
        id, image, issueType, severity, confidence, explanation,
        recommendedAction, location, description, status, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        newReport.id,
        newReport.image,
        newReport.issueType,
        newReport.severity,
        newReport.confidence,
        newReport.explanation,
        newReport.recommendedAction,
        newReport.location,
        newReport.description,
        newReport.status,
        newReport.createdAt,
        newReport.updatedAt
      ]
    );

    res.status(201).json(newReport);
  } catch (error) {
    console.error('Error creating report:', error);
    res.status(500).json({ error: 'Failed to create report', details: error.message });
  }
});

/**
 * PATCH /api/reports/:id/status
 * Updates status of a report (Authority / Admin action)
 */
router.patch('/reports/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!status || !VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`
      });
    }

    const db = await getDatabase();
    const existing = db.get('SELECT * FROM reports WHERE id = ?', [req.params.id]);

    if (!existing) {
      return res.status(404).json({ error: `Report with ID '${req.params.id}' not found.` });
    }

    const updatedAt = new Date().toISOString();
    db.run('UPDATE reports SET status = ?, updatedAt = ? WHERE id = ?', [status, updatedAt, req.params.id]);

    const updated = db.get('SELECT * FROM reports WHERE id = ?', [req.params.id]);
    res.json(updated);
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ error: 'Failed to update status', details: error.message });
  }
});

/**
 * POST /api/reports/reset-seed
 * Helper to restore initial sample reports
 */
router.post('/reports/reset-seed', async (req, res) => {
  try {
    const db = await getDatabase();
    db.run('DELETE FROM reports');
    const seedReports = require('../database/seedData');
    for (const report of seedReports) {
      db.run(
        `INSERT INTO reports (
          id, image, issueType, severity, confidence, explanation,
          recommendedAction, location, description, status, createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          report.id,
          report.image,
          report.issueType,
          report.severity,
          report.confidence,
          report.explanation,
          report.recommendedAction,
          report.location,
          report.description,
          report.status,
          report.createdAt,
          report.updatedAt || report.createdAt
        ]
      );
    }
    res.json({ message: 'Seed reports successfully reset', count: seedReports.length });
  } catch (error) {
    console.error('Error resetting seed data:', error);
    res.status(500).json({ error: 'Failed to reset seed data', details: error.message });
  }
});

module.exports = router;
