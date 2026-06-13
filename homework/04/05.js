function buyItem(inventory, itemName) {
  for (let i = 0; i < inventory.length; i++) {
    // 尋找品名相符的商品
    if (inventory[i].name === itemName) {
      // 檢查庫存是否大於 0
      if (inventory[i].quantity > 0) {
        inventory[i].quantity -= 1; // 扣除庫存
        return "購買成功";
      } else {
        return "庫存不足或無此商品";
      }
    }
  }
  return "庫存不足或無此商品"; // 如果整個陣列都找不到商品
}

// 測試結果
let shopInventory = [{name: "蘋果", quantity: 2}, {name: "香蕉", quantity: 0}];
console.log(buyItem(shopInventory, "蘋果")); // 輸出: "購買成功"
console.log(buyItem(shopInventory, "香蕉")); // 輸出: "庫存不足或無此商品"
console.log(shopInventory[0].quantity);      // 輸出: 1 (蘋果庫存變為 1)