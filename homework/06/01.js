// 定義 mathTool 函數，接受三個參數：num1, num2 和回呼函數 action
function mathTool(num1, num2, action) {
  // 執行傳入的回呼函數，並將 num1 與 num2 作為參數傳遞給它
  return action(num1, num2);
}

// 測試相加 (使用傳統匿名函數)
const addResult = mathTool(10, 5, function(a, b) {
  return a + b;
});
console.log(addResult); // 輸出: 15

// 測試相減 (使用箭頭函數，語法更簡潔)
const subResult = mathTool(10, 5, (a, b) => a - b);
console.log(subResult); // 輸出: 5