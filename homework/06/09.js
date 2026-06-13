// 定義包含字串的陣列
const words = ["Task", "Completed"];

// 使用 setTimeout 設定 2 秒 (2000 毫秒) 後執行的動作
setTimeout(() => {
  // 使用 join 方法將陣列元素以空白字元連接成單一字串，並印出結果
  console.log(words.join(" "));
}, 2000);