const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const LEADERBOARD_FILE = path.join(__dirname, 'leaderboard.json');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

function readLeaderboard() {
    try {
        const data = fs.readFileSync(LEADERBOARD_FILE, 'utf-8');
        return JSON.parse(data);
    } catch {
        return [];
    }
}

function writeLeaderboard(data) {
    fs.writeFileSync(LEADERBOARD_FILE, JSON.stringify(data, null, 2));
}

app.get('/api/leaderboard', (req, res) => {
    res.json(readLeaderboard());
});

app.post('/api/leaderboard', (req, res) => {
    const { name, score } = req.body;
    if (!name || score === undefined) {
        return res.status(400).json({ error: '需要提供名稱與分數' });
    }
    const leaderboard = readLeaderboard();
    leaderboard.push({ name, score, date: new Date().toLocaleString('zh-TW') });
    leaderboard.sort((a, b) => b.score - a.score);
    const top20 = leaderboard.slice(0, 20);
    writeLeaderboard(top20);
    res.json({ success: true, rank: top20.findIndex(e => e.name === name && e.score === score) + 1 });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🎯 射擊遊戲伺服器已啟動！`);
    console.log(`🌐 開啟瀏覽器訪問 http://localhost:${PORT}`);
});
