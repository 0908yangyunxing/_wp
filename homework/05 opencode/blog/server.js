const express = require('express');
const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const app = express();
const DB_PATH = path.join(__dirname, 'blog.db');

let db;

async function initDB() {
  const SQL = await initSqlJs();
  let data;
  if (fs.existsSync(DB_PATH)) {
    data = fs.readFileSync(DB_PATH);
    db = new SQL.Database(data);
  } else {
    db = new SQL.Database();
  }
  db.run(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  saveDB();
}

function saveDB() {
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(DB_PATH, buffer);
}

app.use(express.json());
app.use(express.static('public'));

app.get('/api/posts', (req, res) => {
  const stmt = db.prepare('SELECT * FROM posts ORDER BY created_at DESC');
  const posts = [];
  while (stmt.step()) {
    posts.push(stmt.getAsObject());
  }
  stmt.free();
  res.json(posts);
});

app.get('/api/posts/:id', (req, res) => {
  const stmt = db.prepare('SELECT * FROM posts WHERE id = ?');
  stmt.bind([req.params.id]);
  if (stmt.step()) {
    const post = stmt.getAsObject();
    stmt.free();
    res.json(post);
  } else {
    stmt.free();
    res.status(404).json({ error: 'Post not found' });
  }
});

app.post('/api/posts', (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }
  db.run('INSERT INTO posts (title, content) VALUES (?, ?)', [title, content]);
  const id = db.exec('SELECT last_insert_rowid() as id')[0].values[0][0];
  saveDB();
  res.json({ id });
});

app.delete('/api/posts/:id', (req, res) => {
  db.run('DELETE FROM posts WHERE id = ?', [req.params.id]);
  saveDB();
  res.json({ success: true });
});

const PORT = 3000;
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Blog running at http://localhost:${PORT}`);
  });
});
