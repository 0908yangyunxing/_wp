function getCheapProducts(jsonString, maxPrice) {
  let products = JSON.parse(jsonString);
  let cheapProducts = [];
  
  for (let i = 0; i < products.length; i++) {
    if (products[i].price <= maxPrice) {
      cheapProducts.push(products[i].name);
    }
  }
  
  return cheapProducts;
}

// 測試結果
let productJson = '[{"name":"滑鼠","price":500},{"name":"鍵盤","price":1500},{"name":"耳機","price":800}]';
console.log(getCheapProducts(productJson, 1000)); 
// 輸出: ["滑鼠", "耳機"]