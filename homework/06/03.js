const prices = [100, 200, 300, 400];

// 使用 map 結合單行箭頭函數計算打 8 折 (乘上 0.8) 的結果
const discountedPrices = prices.map(price => price * 0.8);

console.log(discountedPrices); // 輸出: [80, 160, 240, 320]