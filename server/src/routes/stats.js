const express = require('express');
const { getDatabase } = require('../database/db');

const router = express.Router();

/**
 * GET /api/stats
 * Aggregate dashboard statistics
 */
router.get('/stats', async (req, res) => {
  try {
    const db = await getDatabase();
    const reports = db.all('SELECT * FROM reports');

    const total = reports.length;
    let critical = 0;
    let high = 0;
    let medium = 0;
    let low = 0;

    let pending = 0;
    let underReview = 0;
    let inProgress = 0;
    let resolved = 0;

    const byType = {
      'Pothole': 0,
      'Damaged Road': 0,
      'Broken Streetlight': 0,
      'Overflowing Drain': 0,
      'Other Infrastructure Issue': 0
    };

    reports.forEach(r => {
      // Severity
      if (r.severity === 'Critical') critical++;
      else if (r.severity === 'High') high++;
      else if (r.severity === 'Medium') medium++;
      else if (r.severity === 'Low') low++;

      // Status
      if (r.status === 'Pending') pending++;
      else if (r.status === 'Under Review') underReview++;
      else if (r.status === 'In Progress') inProgress++;
      else if (r.status === 'Resolved') resolved++;

      // Issue Type
      if (byType[r.issueType] !== undefined) {
        byType[r.issueType]++;
      } else {
        byType['Other Infrastructure Issue']++;
      }
    });

    const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

    res.json({
      total,
      critical,
      high,
      criticalAndHigh: critical + high,
      pending,
      underReview,
      inProgress,
      resolved,
      resolutionRate,
      byType,
      bySeverity: {
        Critical: critical,
        High: high,
        Medium: medium,
        Low: low
      }
    });
  } catch (error) {
    console.error('Error computing stats:', error);
    res.status(500).json({ error: 'Failed to compute dashboard stats', details: error.message });
  }
});

module.exports = router;
