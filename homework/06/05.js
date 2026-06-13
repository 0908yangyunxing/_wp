// 定義 multiplier 函數，接受一個參數 factor
function multiplier(factor) {
  // 回傳一個箭頭函數，這個內部函數接受參數 n，並將 n 與 factor 相乘
  return (n) => n * factor;
}

// 範例用法：建立一個「乘以 2」的函數
const double = multiplier(2);
console.log(double(10)); // 輸出: 20

// 額外範例：建立一個「乘以 5」的函數
const triple = multiplier(5);
console.log(triple(10)); // 輸出: 50