const fs = require('fs');
const path = require('path');

let passed = 0;
let failed = 0;

function test(description, fn) {
    try {
        fn();
        console.log(`✅ ${description}`);
        passed++;
    } catch (e) {
        console.log(`❌ ${description}`);
        console.log(`   ${e.message}`);
        failed++;
    }
}

function assert(condition, message) {
    if (!condition) throw new Error(message || '斷言失敗');
}

// 1. 檢查專案結構
test('專案目錄結構存在', () => {
    assert(fs.existsSync(path.join(__dirname, 'package.json')), '缺少 package.json');
    assert(fs.existsSync(path.join(__dirname, 'server.js')), '缺少 server.js');
    assert(fs.existsSync(path.join(__dirname, 'public')), '缺少 public/');
    assert(fs.existsSync(path.join(__dirname, 'leaderboard.json')), '缺少 leaderboard.json');
});

test('public 目錄包含必要檔案', () => {
    const publicDir = path.join(__dirname, 'public');
    assert(fs.existsSync(path.join(publicDir, 'index.html')), '缺少 index.html');
    assert(fs.existsSync(path.join(publicDir, 'game.html')), '缺少 game.html');
    assert(fs.existsSync(path.join(publicDir, 'game.js')), '缺少 game.js');
    assert(fs.existsSync(path.join(publicDir, 'style.css')), '缺少 style.css');
});

// 2. 檢查 package.json
test('package.json 包含必要資訊', () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf-8'));
    assert(pkg.dependencies && pkg.dependencies.express, '缺少 express 相依');
    assert(pkg.scripts && pkg.scripts.start, '缺少 start 腳本');
});

// 3. 檢查 server.js - API 路由
test('server.js 包含排行榜 API', () => {
    const content = fs.readFileSync(path.join(__dirname, 'server.js'), 'utf-8');
    assert(content.includes('/api/leaderboard'), '缺少 /api/leaderboard 路由');
    assert(content.includes('GET') || content.includes('app.get'), '缺少 GET');
    assert(content.includes('POST') || content.includes('app.post'), '缺少 POST');
});

// 4. 檢查 game.js - 核心邏輯
test('game.js 包含四種目標類型', () => {
    const content = fs.readFileSync(path.join(__dirname, 'public', 'game.js'), 'utf-8');
    assert(content.includes('軍人') || content.includes('soldier'), '缺少軍人目標');
    assert(content.includes('平民') || content.includes('civilian'), '缺少平民目標');
    assert(content.includes('坦克') || content.includes('tank'), '缺少坦克目標');
    assert(content.includes('機器怪物') || content.includes('robot'), '缺少機器怪物目標');
});

test('game.js 包含正確分數邏輯', () => {
    const content = fs.readFileSync(path.join(__dirname, 'public', 'game.js'), 'utf-8');
    assert(content.includes('10') || content.includes('10分'), '軍人應為 +10 分');
    assert(content.includes('-30') || content.includes('-30'), '平民應為 -30 分');
    assert(content.includes('50') || content.includes('50分'), '坦克應為 +50 分');
    assert(content.includes('100') || content.includes('100分'), '機器怪物應為 +100 分');
});

test('game.js 包含機器怪物生成條件', () => {
    const content = fs.readFileSync(path.join(__dirname, 'public', 'game.js'), 'utf-8');
    assert(content.includes('15') && (content.includes('軍人') || content.includes('soldier')), '需要 15 個軍人');
    assert(content.includes('5') && (content.includes('坦克') || content.includes('tank')), '需要 5 個坦克');
});

test('game.js 包含遊戲時長 1.5 分鐘', () => {
    const content = fs.readFileSync(path.join(__dirname, 'public', 'game.js'), 'utf-8');
    const has90 = content.includes('90');
    const has1_5min = content.includes('1.5') || content.includes('1.5分鐘') || content.includes('一分半') || content.includes('1分半');
    const has90sec = content.includes('90秒') || content.includes('90 秒');
    assert(has90 || has1_5min || has90sec, '遊戲時長應為 1.5 分鐘（90 秒）');
});

test('game.js 包含計時器邏輯', () => {
    const content = fs.readFileSync(path.join(__dirname, 'public', 'game.js'), 'utf-8');
    assert(content.includes('setInterval') || content.includes('setTimeout') || content.includes('requestAnimationFrame'), '需要計時器');
    assert(content.includes('timeLeft') || content.includes('time') || content.includes('計時'), '需要時間變數');
});

// 5. 檢查 index.html
test('index.html 包含名稱輸入與開始按鈕', () => {
    const content = fs.readFileSync(path.join(__dirname, 'public', 'index.html'), 'utf-8');
    assert(content.includes('input') || content.includes('輸入'), '需要輸入框');
    assert(content.includes('開始') || content.includes('start'), '需要開始按鈕');
});

test('index.html 顯示排行榜', () => {
    const content = fs.readFileSync(path.join(__dirname, 'public', 'index.html'), 'utf-8');
    assert(content.includes('排行') || content.includes('leaderboard'), '需要排行榜顯示');
});

// 6. 檢查 README.md
test('README.md 存在並包含必要內容', () => {
    const readmePath = path.join(__dirname, 'README.md');
    assert(fs.existsSync(readmePath), '缺少 README.md');
    const content = fs.readFileSync(readmePath, 'utf-8');
    assert(content.includes('特色') || content.includes('features'), '需要遊戲特色說明');
    assert(content.includes('規則') || content.includes('rules'), '需要遊戲規則說明');
    assert(content.includes('執行') || content.includes('run') || content.includes('start'), '需要執行方式說明');
});

console.log(`\n📊 測試結果：${passed} 通過, ${failed} 失敗, 共 ${passed + failed} 項`);
if (failed > 0) process.exit(1);
