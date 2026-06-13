// 1. 建立一個名為 params 的空物件
const params = {};

// 2. 動態新增屬性 "id"，並賦值為 99
params.id = 99; 
// 💡 如果鍵名存在變數裡，也可以用中括號寫法： params["id"] = 99;

// 3. 印出這個物件
console.log(params);
// 輸出結果: { id: 99 }