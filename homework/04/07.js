function objectToArray(obj) {
  let result = [];
  
  // for...in 專門用來走訪物件的屬性 (keys)
  for (let key in obj) {
    // 建立新物件推入陣列
    result.push({ 
      key: key, 
      value: obj[key] 
    });
  }
  
  return result;
}

// 測試結果
let fruits = { apple: 3, banana: 5 };
console.log(objectToArray(fruits)); 
// 輸出: [ { key: 'apple', value: 3 }, { key: 'banana', value: 5 } ]