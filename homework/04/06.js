function calculateFactorial(n) {
  let result = 1;
  let current = n;
  
  while (current > 0) {
    result *= current; // result = result * current
    current--;         // current 減 1
  }
  
  return result;
}

// 測試結果
console.log(calculateFactorial(5)); // 輸出: 120 (5*4*3*2*1)