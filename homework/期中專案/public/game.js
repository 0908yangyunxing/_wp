const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 900;
canvas.height = 600;

const TARGETS = {
    soldier: { color: '#27ae60', points: 10, radius: 22, label: '軍人', emoji: '🪖', weight: 40, hitRequired: 15 },
    civilian: { color: '#e74c3c', points: -30, radius: 20, label: '平民', emoji: '👤', weight: 20 },
    tank: { color: '#8B4513', points: 50, radius: 32, label: '坦克', emoji: '', weight: 25, hitRequired: 5 },
    robot: { color: '#8e44ad', points: 100, radius: 36, label: '機器怪物', emoji: '👾', weight: 0 },
};

let playerName = localStorage.getItem('playerName') || '未知';
document.getElementById('playerNameDisplay').textContent = playerName;

let targets = [];
let score = 0;
let timeLeft = 90;
let soldiersHit = 0;
let tanksHit = 0;
let robotSpawned = false;
let robotAlive = false;
let gameOver = false;
let gameRunning = false;
let spawnTimer = 0;
let mouseX = 0;
let mouseY = 0;
let stars = [];
let particles = [];

let animFrameId = null;
let lastTime = 0;

function initStars() {
    stars = [];
    for (let i = 0; i < 60; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 0.5,
            alpha: Math.random() * 0.5 + 0.2,
            speed: Math.random() * 0.3 + 0.1,
        });
    }
}
initStars();

function resetGame() {
    targets = [];
    score = 0;
    timeLeft = 90;
    soldiersHit = 0;
    tanksHit = 0;
    robotSpawned = false;
    robotAlive = false;
    gameOver = false;
    gameRunning = true;
    spawnTimer = 0;
    particles = [];
    document.getElementById('gameOverOverlay').classList.add('hidden');
    updateHUD();
}

function spawnTarget() {
    if (!gameRunning || gameOver) return;

    const availableTypes = ['soldier', 'civilian', 'tank'];

    if (!robotSpawned && soldiersHit >= 15 && tanksHit >= 5) {
        robotSpawned = true;
        document.getElementById('robotStatusText').textContent = '✅ 已解鎖！';
        document.getElementById('robotStatusText').style.color = '#2ecc71';
    }

    const count = Math.random() < 0.3 ? 2 : 1;

    for (let i = 0; i < count; i++) {
        const weights = {};
        availableTypes.forEach(t => { weights[t] = TARGETS[t].weight; });
        if (robotSpawned && !robotAlive) {
            if (Math.random() < 0.12) {
                spawnRobot();
                continue;
            }
        }

        const type = weightedRandom(weights);
        const target = TARGETS[type];
        const radius = target.radius;
        const x = Math.random() * (canvas.width - radius * 2) + radius;
        const y = Math.random() * (canvas.height - radius * 2) + radius;

        targets.push({
            type: type,
            x: x,
            y: y,
            radius: radius,
            vx: (Math.random() - 0.5) * 1.2,
            vy: (Math.random() - 0.5) * 1.2,
            lifetime: Math.random() * 2 + 1.5,
            maxLifetime: Math.random() * 2 + 1.5,
            hue: Math.random() * 360,
        });
    }
}

function spawnRobot() {
    if (robotAlive) return;
    const target = TARGETS.robot;
    const radius = target.radius + 8;
    const x = Math.random() * (canvas.width - radius * 2) + radius;
    const y = Math.random() * (canvas.height - radius * 2) + radius;

    targets.push({
        type: 'robot',
        x: x,
        y: y,
        radius: radius,
        vx: (Math.random() - 0.5) * 2.0,
        vy: (Math.random() - 0.5) * 2.0,
        lifetime: 4.0,
        maxLifetime: 4.0,
        hue: 280,
    });
    robotAlive = true;
}

function weightedRandom(weights) {
    const entries = Object.entries(weights);
    const total = entries.reduce((s, [, w]) => s + w, 0);
    let r = Math.random() * total;
    for (const [type, weight] of entries) {
        r -= weight;
        if (r <= 0) return type;
    }
    return entries[0][0];
}

function updateHUD() {
    document.getElementById('scoreDisplay').textContent = score;
    const mins = Math.floor(timeLeft / 60);
    const secs = Math.floor(timeLeft % 60);
    document.getElementById('timerDisplay').textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
    document.getElementById('soldierCount').textContent = soldiersHit;
    document.getElementById('tankCount').textContent = tanksHit;
}

function updateTargets(dt) {
    for (let i = targets.length - 1; i >= 0; i--) {
        const t = targets[i];
        t.lifetime -= dt;
        t.x += t.vx;
        t.y += t.vy;

        if (t.x - t.radius < 0 || t.x + t.radius > canvas.width) { t.vx *= -1; t.x = Math.max(t.radius, Math.min(canvas.width - t.radius, t.x)); }
        if (t.y - t.radius < 0 || t.y + t.radius > canvas.height) { t.vy *= -1; t.y = Math.max(t.radius, Math.min(canvas.height - t.radius, t.y)); }

        if (t.lifetime <= 0) {
            if (t.type === 'robot') robotAlive = false;
            targets.splice(i, 1);
        }
    }
}

function drawTarget(t, time) {
    const cfg = TARGETS[t.type];
    const pulse = t.type === 'robot' ? Math.sin(time * 6) * 0.08 + 1 : 1;
    const r = t.radius * pulse;

    ctx.save();

    if (t.type === 'robot') {
        const s = r * 0.85;

        ctx.shadowColor = '#00ffff';
        ctx.shadowBlur = 25;

        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(t.x, t.y, r + 3, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#2a1a4a';
        ctx.beginPath();
        ctx.arc(t.x, t.y, r, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#4a2a6a';
        ctx.beginPath();
        ctx.arc(t.x, t.y, r * 0.7, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#6b3a9a';
        ctx.fillRect(t.x - s * 0.5, t.y - s * 0.15, s * 1.0, s * 0.3);

        ctx.fillStyle = '#8a4aba';
        ctx.fillRect(t.x - s * 0.3, t.y - s * 0.4, s * 0.6, s * 0.25);

        ctx.fillStyle = '#ff4444';
        ctx.fillRect(t.x - s * 0.25, t.y - s * 0.35, s * 0.15, s * 0.1);
        ctx.fillRect(t.x + s * 0.1, t.y - s * 0.35, s * 0.15, s * 0.1);

        ctx.fillStyle = '#00ffff';
        ctx.fillRect(t.x - s * 0.22, t.y - s * 0.33, s * 0.1, s * 0.06);
        ctx.fillRect(t.x + s * 0.12, t.y - s * 0.33, s * 0.1, s * 0.06);

        ctx.fillStyle = '#888';
        ctx.fillRect(t.x - s * 0.02, t.y - s * 0.6, s * 0.04, s * 0.2);

        ctx.fillStyle = '#aaa';
        ctx.beginPath();
        ctx.arc(t.x, t.y - s * 0.6, s * 0.08, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#666';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(t.x - s * 0.4, t.y + s * 0.25);
        ctx.lineTo(t.x - s * 0.6, t.y + s * 0.6);
        ctx.moveTo(t.x + s * 0.4, t.y + s * 0.25);
        ctx.lineTo(t.x + s * 0.6, t.y + s * 0.6);
        ctx.stroke();

        ctx.fillStyle = '#555';
        ctx.beginPath();
        ctx.arc(t.x - s * 0.6, t.y + s * 0.6, s * 0.1, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(t.x + s * 0.6, t.y + s * 0.6, s * 0.1, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;
    } else if (t.type === 'tank') {
        const s = r * 0.9;

        ctx.shadowColor = '#8B4513';
        ctx.shadowBlur = 15;

        ctx.fillStyle = '#5d3a1a';
        ctx.fillRect(t.x - s * 0.9, t.y - s * 0.3, s * 1.8, s * 0.6);

        ctx.fillStyle = '#8B4513';
        ctx.fillRect(t.x - s * 0.6, t.y - s * 0.5, s * 1.2, s * 0.4);

        ctx.fillStyle = '#c98a4a';
        ctx.fillRect(t.x - s * 0.5, t.y - s * 0.45, s * 1.0, s * 0.3);

        ctx.fillStyle = '#3d2a1a';
        ctx.beginPath();
        ctx.arc(t.x - s * 0.5, t.y + s * 0.35, s * 0.2, 0, Math.PI * 2);
        ctx.arc(t.x + s * 0.5, t.y + s * 0.35, s * 0.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#2a1a0a';
        ctx.fillRect(t.x - s * 0.1, t.y - s * 0.7, s * 0.2, s * 0.3);

        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(t.x - s * 0.06, t.y - s * 0.7, s * 0.12, s * 0.1);

        ctx.strokeStyle = '#f1c40f';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(t.x, t.y, r + 2, 0, Math.PI * 2);
        ctx.stroke();

        ctx.shadowBlur = 0;
    } else if (t.type === 'civilian') {
        ctx.fillStyle = cfg.color;
        ctx.shadowColor = 'rgba(231, 76, 60, 0.3)';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(t.x, t.y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.font = '26px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('👤', t.x, t.y);
    } else {
        ctx.fillStyle = cfg.color;
        ctx.shadowColor = 'rgba(39, 174, 96, 0.3)';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(t.x, t.y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.font = '26px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🪖', t.x, t.y);
    }

    ctx.restore();
}

function spawnParticles(x, y, color, count) {
    for (let i = 0; i < count; i++) {
        particles.push({
            x, y,
            vx: (Math.random() - 0.5) * 6,
            vy: (Math.random() - 0.5) * 6,
            life: 1,
            maxLife: 0.6 + Math.random() * 0.4,
            color: color,
            size: Math.random() * 5 + 2,
        });
    }
}

function updateParticles(dt) {
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= dt;
        p.vy += 1.5 * dt;
        if (p.life <= 0) particles.splice(i, 1);
    }
}

function drawParticles() {
    for (const p of particles) {
        const alpha = Math.max(0, p.life / p.maxLife);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.globalAlpha = 1;
}

function drawCrosshair() {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 2;
    const size = 15;
    ctx.beginPath();
    ctx.moveTo(mouseX - size, mouseY);
    ctx.lineTo(mouseX + size, mouseY);
    ctx.moveTo(mouseX, mouseY - size);
    ctx.lineTo(mouseX, mouseY + size);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(255, 50, 50, 0.5)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(mouseX, mouseY, size + 4, 0, Math.PI * 2);
    ctx.stroke();
}

function drawBackground(time) {
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#0a0a2e');
    gradient.addColorStop(0.5, '#1a1a4e');
    gradient.addColorStop(1, '#0d0d2b');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (const star of stars) {
        star.alpha = 0.3 + Math.sin(time * star.speed + star.x * 0.01) * 0.3;
        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function handleHit(targetIndex) {
    const t = targets[targetIndex];
    const cfg = TARGETS[t.type];
    score += cfg.points;

    spawnParticles(t.x, t.y, cfg.color, 20);

    if (t.type === 'soldier') {
        soldiersHit++;
    } else if (t.type === 'tank') {
        tanksHit++;
    } else if (t.type === 'robot') {
        robotAlive = false;
    }

    targets.splice(targetIndex, 1);
    updateHUD();
}

function getHitTarget() {
    let best = -1;
    let bestR = Infinity;
    for (let i = 0; i < targets.length; i++) {
        const t = targets[i];
        const dx = mouseX - t.x;
        const dy = mouseY - t.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < t.radius && dist < bestR) {
            bestR = dist;
            best = i;
        }
    }
    return best;
}

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
});

canvas.addEventListener('click', () => {
    if (!gameRunning || gameOver) return;
    const idx = getHitTarget();
    if (idx >= 0) handleHit(idx);
});

function endGame() {
    gameOver = true;
    gameRunning = false;
    document.getElementById('finalScore').textContent = score;
    document.getElementById('gameOverOverlay').classList.remove('hidden');

    fetch('/api/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: playerName, score: score }),
    })
    .then(r => r.json())
    .then(data => {
        if (data.rank) {
            document.getElementById('rankInfo').textContent = `🏅 排名第 ${data.rank} 名！`;
        }
    })
    .catch(() => {
        document.getElementById('rankInfo').textContent = '排行榜上傳失敗';
    });
}

function goHome() {
    window.location.href = 'index.html';
}

function gameLoop(time) {
    if (!lastTime) lastTime = time;
    const dt = Math.min((time - lastTime) / 1000, 0.05);
    lastTime = time;

    if (gameRunning && !gameOver) {
        timeLeft -= dt;
        spawnTimer += dt;

        if (spawnTimer >= 1.2) {
            spawnTarget();
            spawnTimer = 0;
        }

        updateTargets(dt);
        updateParticles(dt);

        if (timeLeft <= 0) {
            timeLeft = 0;
            updateHUD();
            endGame();
        }
        updateHUD();
    }

    drawBackground(time / 1000);
    for (const t of targets) {
        drawTarget(t, time / 1000);
    }
    drawParticles();
    if (gameRunning && !gameOver) drawCrosshair();

    animFrameId = requestAnimationFrame(gameLoop);
}

resetGame();
gameLoop(0);
