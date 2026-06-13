function countFrequencies(items) {
  let counts = {}; // 用來記錄次數的物件
  let i = 0;
  
  while (i < items.length) {
    let item = items[i];
    
    // 如果物件中已經有這個 key，次數加 1
    if (counts[item]) {
      counts[item]++;
    } else {
      // 如果沒有這個 key，初始化為 1
      counts[item] = 1;
    }
    i++;
  }
  
  return counts;
}

// 測試結果
let words = ["apple", "banana", "apple", "orange", "banana", "apple"];
console.log(countFrequencies(words)); 
// 輸出: { apple: 3, banana: 2, orange: 1 }