function sumArray(numbers) {
  let sum = 0;
  // 使用 for 迴圈逐一讀取陣列內的數字並加總
  for (let i = 0; i < numbers.length; i++) {
    sum += numbers[i];
  }
  return sum;
}

// 測試結果
console.log(sumArray([1, 2, 3, 4, 5])); // 輸出: 15