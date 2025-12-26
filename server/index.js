import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Database from 'better-sqlite3';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize SQLite database
const db = new Database('predictions.db');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS predictions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    prediction_text TEXT NOT NULL,
    category TEXT,
    is_outrageous BOOLEAN DEFAULT 0,
    status TEXT DEFAULT 'pending',
    votes INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS votes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    prediction_id INTEGER NOT NULL,
    voter_username TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(prediction_id, voter_username),
    FOREIGN KEY (prediction_id) REFERENCES predictions(id)
  );
`);

// API Routes

// Submit predictions
app.post('/api/predictions', (req, res) => {
  try {
    const { username, predictions } = req.body;

    if (!username || !predictions || predictions.length !== 3) {
      return res.status(400).json({ error: 'Username and exactly 3 predictions required' });
    }

    // Get or create user
    let user = db.prepare('SELECT id FROM users WHERE username = ?').get(username);

    if (!user) {
      const result = db.prepare('INSERT INTO users (username) VALUES (?)').run(username);
      user = { id: result.lastInsertRowid };
    }

    // Insert predictions
    const insertPred = db.prepare('INSERT INTO predictions (user_id, prediction_text, category) VALUES (?, ?, ?)');

    predictions.forEach(pred => {
      insertPred.run(user.id, pred.text, pred.category || 'general');
    });

    res.json({ success: true, message: 'Predictions submitted!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to submit predictions' });
  }
});

// Get all predictions
app.get('/api/predictions', (req, res) => {
  try {
    const predictions = db.prepare(`
      SELECT p.*, u.username
      FROM predictions p
      JOIN users u ON p.user_id = u.id
      ORDER BY p.created_at DESC
      LIMIT 100
    `).all();

    res.json(predictions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch predictions' });
  }
});

// Get leaderboard (top predictors by correct predictions)
app.get('/api/leaderboard', (req, res) => {
  try {
    const leaderboard = db.prepare(`
      SELECT
        u.username,
        COUNT(CASE WHEN p.status = 'correct' THEN 1 END) as correct_count,
        COUNT(CASE WHEN p.status = 'incorrect' THEN 1 END) as incorrect_count,
        COUNT(*) as total_predictions,
        MAX(CASE WHEN p.status = 'correct' AND p.is_outrageous = 1 THEN 1 ELSE 0 END) as has_outrageous
      FROM users u
      LEFT JOIN predictions p ON u.id = p.user_id
      GROUP BY u.id, u.username
      ORDER BY correct_count DESC, has_outrageous DESC
      LIMIT 5
    `).all();

    res.json(leaderboard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// Get fun stats
app.get('/api/stats', (req, res) => {
  try {
    // Most voted prediction
    const mostPopular = db.prepare(`
      SELECT p.*, u.username, p.votes
      FROM predictions p
      JOIN users u ON p.user_id = u.id
      WHERE p.status = 'pending'
      ORDER BY p.votes DESC
      LIMIT 1
    `).get();

    // Most outrageous that came true
    const mostOutrageous = db.prepare(`
      SELECT p.*, u.username
      FROM predictions p
      JOIN users u ON p.user_id = u.id
      WHERE p.status = 'correct' AND p.is_outrageous = 1
      ORDER BY p.created_at DESC
      LIMIT 1
    `).get();

    // Most picked that didn't happen
    const mostWrong = db.prepare(`
      SELECT p.*, u.username, p.votes
      FROM predictions p
      JOIN users u ON p.user_id = u.id
      WHERE p.status = 'incorrect'
      ORDER BY p.votes DESC
      LIMIT 1
    `).get();

    // Total stats
    const totalStats = db.prepare(`
      SELECT
        COUNT(*) as total_predictions,
        COUNT(DISTINCT user_id) as total_users,
        COUNT(CASE WHEN status = 'correct' THEN 1 END) as correct_predictions,
        COUNT(CASE WHEN status = 'incorrect' THEN 1 END) as incorrect_predictions
      FROM predictions
    `).get();

    // Recent wild predictions
    const wildPredictions = db.prepare(`
      SELECT p.*, u.username
      FROM predictions p
      JOIN users u ON p.user_id = u.id
      ORDER BY p.created_at DESC
      LIMIT 5
    `).all();

    res.json({
      mostPopular,
      mostOutrageous,
      mostWrong,
      totalStats,
      wildPredictions
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Vote for a prediction
app.post('/api/predictions/:id/vote', (req, res) => {
  try {
    const { id } = req.params;
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ error: 'Username required' });
    }

    // Check if already voted
    const existingVote = db.prepare('SELECT id FROM votes WHERE prediction_id = ? AND voter_username = ?')
      .get(id, username);

    if (existingVote) {
      return res.status(400).json({ error: 'Already voted for this prediction' });
    }

    // Add vote
    db.prepare('INSERT INTO votes (prediction_id, voter_username) VALUES (?, ?)').run(id, username);

    // Update vote count
    db.prepare('UPDATE predictions SET votes = votes + 1 WHERE id = ?').run(id);

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to vote' });
  }
});

// Admin endpoint to update prediction status
app.put('/api/admin/predictions/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { status, is_outrageous } = req.body;

    const updates = [];
    const values = [];

    if (status) {
      updates.push('status = ?');
      values.push(status);
    }
    if (is_outrageous !== undefined) {
      updates.push('is_outrageous = ?');
      values.push(is_outrageous ? 1 : 0);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No updates provided' });
    }

    values.push(id);

    db.prepare(`UPDATE predictions SET ${updates.join(', ')} WHERE id = ?`).run(...values);

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update prediction' });
  }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(join(__dirname, '../client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(join(__dirname, '../client/dist/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`🔮 Prediction Leaderboard server running on port ${PORT}`);
});
