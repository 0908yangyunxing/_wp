function findFirstLargeNumber(numbers, target) {
  let i = 0;
  
  // 當 i 還小於陣列長度時，繼續執行 while 迴圈
  while (i < numbers.length) {
    if (numbers[i] > target) {
      return numbers[i]; // 找到後立刻回傳，結束函式
    }
    i++; // 別忘了將 i 加 1，否則會變成無窮迴圈
  }
  
  return null; // 如果迴圈跑完都沒找到，回傳 null
}

// 測試結果
console.log(findFirstLargeNumber([10, 25, 47, 89, 12], 50)); // 輸出: 89