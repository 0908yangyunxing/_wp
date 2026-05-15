const express = require('express');
const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const app = express();
const DB_PATH = path.join(__dirname, 'blog.db');

let db;

async function initDB() {
  const SQL = await initSqlJs();
  if (fs.existsSync(DB_PATH)) {
    const data = fs.readFileSync(DB_PATH);
    db = new SQL.Database(data);
  } else {
    db = new SQL.Database();
  }
  db.run(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      tags TEXT DEFAULT '',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  saveDB();
}

function saveDB() {
  const data = db.export();
  fs.writeFileSync(DB_PATH, Buffer.from(data));
}

app.use(express.json());
app.use(express.static('public'));
app.use('/lib', express.static(path.join(__dirname, 'node_modules')));

app.get('/api/posts', (req, res) => {
  try {
    const { search, tag, page = 1, limit = 10 } = req.query;
    const offset = (Math.max(1, parseInt(page)) - 1) * parseInt(limit);

    const conditions = [];
    const params = [];

    if (search) {
      conditions.push('(title LIKE ? OR content LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }
    if (tag) {
      conditions.push('tags LIKE ?');
      params.push(`%${tag}%`);
    }

    const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';

    const countStmt = db.prepare(`SELECT COUNT(*) as total FROM posts ${where}`);
    countStmt.bind(params);
    countStmt.step();
    const { total } = countStmt.getAsObject();
    countStmt.free();

    const stmt = db.prepare(`SELECT * FROM posts ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`);
    stmt.bind([...params, parseInt(limit), offset]);
    const posts = [];
    while (stmt.step()) {
      const post = stmt.getAsObject();
      post.tags = post.tags ? post.tags.split(',').filter(t => t.trim()) : [];
      posts.push(post);
    }
    stmt.free();

    res.json({ posts, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
  } catch (err) {
    res.status(500).json({ error: '無法取得文章' });
  }
});

app.get('/api/posts/:id', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM posts WHERE id = ?');
    stmt.bind([req.params.id]);
    if (stmt.step()) {
      const post = stmt.getAsObject();
      post.tags = post.tags ? post.tags.split(',').filter(t => t.trim()) : [];
      stmt.free();
      res.json(post);
    } else {
      stmt.free();
      res.status(404).json({ error: '文章不存在' });
    }
  } catch (err) {
    res.status(500).json({ error: '無法取得文章' });
  }
});

app.post('/api/posts', (req, res) => {
  try {
    let { title, content, tags } = req.body;
    if (!title || !title.trim()) return res.status(400).json({ error: '標題為必填' });
    if (!content || !content.trim()) return res.status(400).json({ error: '內容為必填' });
    title = title.trim();
    content = content.trim();
    const tagsStr = (tags || '').split(',').map(t => t.trim()).filter(t => t).join(',');

    db.run('INSERT INTO posts (title, content, tags) VALUES (?, ?, ?)', [title, content, tagsStr]);
    const id = db.exec('SELECT last_insert_rowid() as id')[0].values[0][0];
    saveDB();
    res.status(201).json({ id });
  } catch (err) {
    res.status(500).json({ error: '無法建立文章' });
  }
});

app.put('/api/posts/:id', (req, res) => {
  try {
    let { title, content, tags } = req.body;
    if (!title || !title.trim()) return res.status(400).json({ error: '標題為必填' });
    if (!content || !content.trim()) return res.status(400).json({ error: '內容為必填' });
    title = title.trim();
    content = content.trim();
    const tagsStr = (tags || '').split(',').map(t => t.trim()).filter(t => t).join(',');

    const check = db.prepare('SELECT id FROM posts WHERE id = ?');
    check.bind([req.params.id]);
    if (!check.step()) { check.free(); return res.status(404).json({ error: '文章不存在' }); }
    check.free();

    db.run('UPDATE posts SET title = ?, content = ?, tags = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [title, content, tagsStr, req.params.id]);
    saveDB();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: '無法更新文章' });
  }
});

app.delete('/api/posts/:id', (req, res) => {
  try {
    const check = db.prepare('SELECT id FROM posts WHERE id = ?');
    check.bind([req.params.id]);
    if (!check.step()) { check.free(); return res.status(404).json({ error: '文章不存在' }); }
    check.free();

    db.run('DELETE FROM posts WHERE id = ?', [req.params.id]);
    saveDB();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: '無法刪除文章' });
  }
});

const PORT = process.env.PORT || 3000;
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Blog running at http://localhost:${PORT}`);
  });
});
