function fetchData(id, callback) {
  // 1. 建立名為 fakeData 的物件
  const fakeData = {
    id: id,             // 可以簡寫為 id,
    status: "success"
  };

  // 2. 呼叫傳入的 callback 函數
  // 第一個參數傳入 null 代表沒有發生錯誤，第二個參數傳入成功取得的資料
  callback(null, fakeData);
}

fetchData(101, (error, data) => {
  if (error) {
    console.error("發生錯誤:", error);
  } else {
    console.log("成功取得資料:", data);
  }
});
// 輸出結果: 成功取得資料: { id: 101, status: 'success' }