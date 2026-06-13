(function() {
  // 在 IIFE 內部定義區域變數
  let count = 100;
  
  // 在執行時直接印出結果
  console.log(`Count is: ${count}`);
})();

// 嘗試在外部存取 count 變數
try {
  console.log(count);
} catch (error) {
  console.error("外部存取測試結果: 發生錯誤", error.message); 
  // 這裡會拋出 ReferenceError: count is not defined
}