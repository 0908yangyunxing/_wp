// 定義 myFilter 函數，接收一個陣列與一個回呼函數
function myFilter(arr, callback) {
  // 1. 建立一個空的新陣列，用來存放符合條件的元素
  const result = [];
  
  // 2. 遍歷傳入的陣列
  for (let i = 0; i < arr.length; i++) {
    // 3. 將當前的元素傳入 callback 中判斷
    // 如果 callback 回傳 true (或 truthy 值)，就將元素加入新陣列
    if (callback(arr[i])) {
      result.push(arr[i]);
    }
  }
  
  // 4. 回傳最終的新陣列
  return result;
}

// 測試：篩選出 [1, 5, 8, 12] 中大於 7 的數字
const numbers = [1, 5, 8, 12];
const greaterThanSeven = myFilter(numbers, (num) => num > 7);

console.log(greaterThanSeven); // 輸出: [8, 12]