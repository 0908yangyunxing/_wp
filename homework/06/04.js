// 定義 cleanData 函數
function cleanData(arr) {
  // 移除陣列的最後一個元素
  arr.pop();
  
  // 在陣列的最前面加上 "Start"
  arr.unshift("Start");
}

// 驗證
let myData = [1, 2, 3];
console.log("執行前的 myData:", myData); // 輸出: [1, 2, 3]

// 執行函數
cleanData(myData);

// 觀察執行後的 myData
console.log("執行後的 myData:", myData); // 輸出: ["Start", 1, 2]