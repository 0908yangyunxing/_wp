// 定義 calculateTotal 函數
function calculateTotal(cart, discountFunc) {
  // 1. 先將 cart 內的所有數字相加得出總和
  // 使用 reduce 方法將陣列化簡為單一數值
  const totalSum = cart.reduce((acc, current) => acc + current, 0);
  
  // 2. 將總和傳入折扣處理的回呼函數，並回傳最終結果
  return discountFunc(totalSum);
}

// 測試：傳入 [100, 200, 300]
const myCart = [100, 200, 300];

// 透過匿名函數（這裡使用箭頭函數寫法）扣除 50 元
const finalPrice = calculateTotal(myCart, (total) => total - 50);

console.log(`原總和為 600，扣除 50 元後的最終價格為: ${finalPrice}`); 
// 輸出: 原總和為 600，扣除 50 元後的最終價格為: 550