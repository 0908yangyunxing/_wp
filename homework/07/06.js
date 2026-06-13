const jsonStr = '{"title": "Post 1", "tags": ["js", "node"]}';

// 1. 將 JSON 字串轉換為 JavaScript 物件
const jsonObj = JSON.parse(jsonStr);

// 2. 取得 tags 陣列，並印出第二個元素（索引值為 1）
console.log(jsonObj.tags[1]); 
// 輸出結果: node