// 1. 宣告變數 user
const user = "Guest"; // 如果把這裡改成 "" 或 null，就會顯示 "Stranger"

// 2. 使用反引號建立 HTML 字串，並在 ${} 中放入判斷邏輯
const html = `<h1>Welcome, ${user || "Stranger"}</h1>`;

console.log(html);
// 輸出結果: <h1>Welcome, Guest</h1>