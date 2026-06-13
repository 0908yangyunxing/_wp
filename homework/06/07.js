const users = [
  { name: "Alice", age: 25 },
  { name: "Bob", age: 17 }
];

// 使用 filter 結合單行箭頭函數篩選出 age >= 18 的使用者
const adults = users.filter(user => user.age >= 18);

console.log(adults); 
// 輸出: [ { name: 'Alice', age: 25 } ]