const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { analyzeImage, getAiConfig, setAiConfig } = require('../services/aiService');

const router = express.Router();

// Configure multer storage
const uploadsDir = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

/**
 * POST /api/analyze
 * Analyzes an image using AI vision (Gemini or Mock)
 */
router.post('/analyze', upload.single('image'), async (req, res) => {
  try {
    let imageBuffer = null;
    let mimeType = 'image/jpeg';
    let filename = '';

    if (req.file) {
      imageBuffer = req.file.buffer;
      mimeType = req.file.mimetype;
      filename = req.file.originalname;
    } else if (req.body.image) {
      // Support Base64 or URL
      const imgString = req.body.image;
      if (imgString.startsWith('data:')) {
        const matches = imgString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          mimeType = matches[1];
          imageBuffer = Buffer.from(matches[2], 'base64');
        }
      } else if (imgString.startsWith('http://') || imgString.startsWith('https://')) {
        // Fetch external image
        try {
          const fetched = await fetch(imgString);
          if (fetched.ok) {
            const arrayBuffer = await fetched.arrayBuffer();
            imageBuffer = Buffer.from(arrayBuffer);
            mimeType = fetched.headers.get('content-type') || 'image/jpeg';
          }
        } catch (fetchErr) {
          console.warn('Could not fetch image URL directly:', fetchErr.message);
        }
      }
    }

    if (!imageBuffer) {
      return res.status(400).json({
        error: 'No image provided. Please upload an image file or provide a base64/URL string.'
      });
    }

    const description = req.body.description || '';
    const hintType = req.body.hintType || req.body.issueTypeHint;
    const forceMock = req.body.forceMock === 'true' || req.body.forceMock === true;

    const analysis = await analyzeImage({
      imageBuffer,
      mimeType,
      filename,
      description,
      hintType,
      forceMock
    });

    res.json(analysis);
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({
      error: 'Failed to analyze infrastructure image.',
      details: error.message
    });
  }
});

/**
 * GET /api/ai/status
 * Get current AI engine status
 */
router.get('/ai/status', (req, res) => {
  res.json(getAiConfig());
});

/**
 * POST /api/ai/config
 * Switch AI mode or set API key dynamically
 */
router.post('/ai/config', (req, res) => {
  const { mode, apiKey } = req.body;
  const updated = setAiConfig({ mode, apiKey });
  res.json(updated);
});

module.exports = router;
