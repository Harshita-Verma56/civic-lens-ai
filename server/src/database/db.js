const fs = require('fs');
const path = require('path');
const initSqlJs = require('sql.js');

const DB_FILE = path.join(__dirname, '..', '..', 'database.sqlite');
let dbInstance = null;

async function getDatabase() {
  if (dbInstance) return dbInstance;

  const SQL = await initSqlJs();
  let db;

  if (fs.existsSync(DB_FILE)) {
    try {
      const fileBuffer = fs.readFileSync(DB_FILE);
      db = new SQL.Database(fileBuffer);
    } catch (err) {
      console.warn('Could not read existing database file, creating a fresh one:', err.message);
      db = new SQL.Database();
    }
  } else {
    db = new SQL.Database();
  }

  // Create table
  db.run(`
    CREATE TABLE IF NOT EXISTS reports (
      id TEXT PRIMARY KEY,
      image TEXT NOT NULL,
      issueType TEXT NOT NULL,
      severity TEXT NOT NULL,
      confidence REAL NOT NULL,
      explanation TEXT NOT NULL,
      recommendedAction TEXT NOT NULL,
      location TEXT,
      description TEXT,
      status TEXT NOT NULL DEFAULT 'Pending',
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );
  `);

  dbInstance = {
    raw: db,
    save() {
      try {
        const data = db.export();
        const buffer = Buffer.from(data);
        fs.writeFileSync(DB_FILE, buffer);
      } catch (err) {
        console.error('Error saving SQLite database to disk:', err);
      }
    },
    all(sql, params = []) {
      const stmt = db.prepare(sql);
      stmt.bind(params);
      const results = [];
      while (stmt.step()) {
        results.push(stmt.getAsObject());
      }
      stmt.free();
      return results;
    },
    get(sql, params = []) {
      const stmt = db.prepare(sql);
      stmt.bind(params);
      let result = null;
      if (stmt.step()) {
        result = stmt.getAsObject();
      }
      stmt.free();
      return result;
    },
    run(sql, params = []) {
      const stmt = db.prepare(sql);
      stmt.run(params);
      stmt.free();
      this.save();
    }
  };

  // Seed sample data if empty
  await seedIfEmpty(dbInstance);

  return dbInstance;
}

async function seedIfEmpty(db) {
  const countObj = db.get('SELECT COUNT(*) as count FROM reports');
  if (countObj && countObj.count > 0) {
    return; // Already populated
  }

  console.log('Seeding initial sample infrastructure reports into database...');
  const seedReports = require('./seedData');
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
  console.log(`Successfully seeded ${seedReports.length} reports.`);
}

module.exports = {
  getDatabase
};
