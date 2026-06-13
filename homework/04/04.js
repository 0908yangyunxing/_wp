function updateUserAge(jsonString, newAge) {
  // 將 JSON 字串轉換為可操作的 JavaScript 物件
  let userObject = JSON.parse(jsonString);
  
  // 更新年齡
  userObject.age = newAge;
  
  // 將物件轉回 JSON 字串
  return JSON.stringify(userObject);
}

// 測試結果
let initialJson = '{"name":"Alice","age":25,"city":"Taipei"}';
console.log(updateUserAge(initialJson, 26)); 
// 輸出: '{"name":"Alice","age":26,"city":"Taipei"}'