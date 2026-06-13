## 習題 4

AI 問答 -- https://gemini.google.com/share/21e10421a8b4

---
#  JavaScript 練習題測試結果
---

## 1. 陣列總和計算 (Array + for + function)
### 【程式碼】

```javascript
function sumArray(numbers) {
  let sum = 0;
  for (let i = 0; i < numbers.length; i++) {
    sum += numbers[i];
  }
  return sum;
}

console.log(sumArray([1, 2, 3, 4, 5]));
```

### 【輸出結果】
```
15
```

---

## 2. 篩選及格學生 (Object + Array + for + if)
### 【程式碼】

```javascript
function getPassingStudents(students) {
  let passingNames = [];
  for (let i = 0; i < students.length; i++) {
    if (students[i].score >= 60) {
      passingNames.push(students[i].name);
    }
  }
  return passingNames;
}

const studentList = [
  { name: "小明", score: 55 },
  { name: "小華", score: 80 },
  { name: "小美", score: 95 }
];

console.log(getPassingStudents(studentList));
```

### 【輸出結果】
```
[ '小華', '小美' ]
```

---

## 3. 使用 While 尋找目標數字 (Array + while + if)
### 【程式碼】

```javascript
function findFirstLargeNumber(numbers, target) {
  let i = 0;
  while (i < numbers.length) {
    if (numbers[i] > target) {
      return numbers[i]; 
    }
    i++; 
  }
  return null; 
}

console.log(findFirstLargeNumber([10, 25, 47, 89, 12], 50));
```

### 【輸出結果】
```
89
```

---

## 4. JSON 資料解析與更新 (JSON + Object + function)
### 【程式碼】

```javascript
function updateUserAge(jsonString, newAge) {
  let userObject = JSON.parse(jsonString);
  userObject.age = newAge;
  return JSON.stringify(userObject);
}

let initialJson = '{"name":"Alice","age":25,"city":"Taipei"}';

console.log(updateUserAge(initialJson, 26));
```

### 【輸出結果】
```
'{"name":"Alice","age":26,"city":"Taipei"}'
```

---

## 5. 庫存檢查與扣除 (Array of Objects + function + if)
### 【程式碼】

```javascript
function buyItem(inventory, itemName) {
  for (let i = 0; i < inventory.length; i++) {
    if (inventory[i].name === itemName) {
      if (inventory[i].quantity > 0) {
        inventory[i].quantity -= 1; 
        return "購買成功";
      } else {
        return "庫存不足或無此商品";
      }
    }
  }
  return "庫存不足或無此商品"; 
}

let shopInventory = [
  {name: "蘋果", quantity: 2}, 
  {name: "香蕉", quantity: 0}
];

console.log(buyItem(shopInventory, "蘋果")); 
console.log(buyItem(shopInventory, "香蕉")); 
console.log(shopInventory[0].quantity);
```
### 【輸出結果】
```
購買成功
庫存不足或無此商品
1
```

---

## 6. 階乘計算 (while + function)
### 【程式碼】

```javascript
function calculateFactorial(n) {
  let result = 1;
  let current = n;
  
  while (current > 0) {
    result *= current; 
    current--;         
  }
  
  return result;
}

console.log(calculateFactorial(5));
```

### 【輸出結果】
```
120
```

---

## 7. 階乘計算 (while + function)
### 【程式碼】

```javascript
function objectToArray(obj) {
  let result = [];
  for (let key in obj) {
    result.push({ 
      key: key, 
      value: obj[key] 
    });
  }
  return result;
}

let fruits = { apple: 3, banana: 5 };

console.log(objectToArray(fruits));
```

### 【輸出結果】
```
[ { key: 'apple', value: 3 }, { key: 'banana', value: 5 } ]
```

---

## 8. 綜合應用：解析 JSON 並篩選便宜商品 (JSON + Array + Object + for + if)
### 【程式碼】

```javascript
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

let productJson = '[{"name":"滑鼠","price":500},{"name":"鍵盤","price":1500},{"name":"耳機","price":800}]';

console.log(getCheapProducts(productJson, 1000));
```

### 【輸出結果】
```
[ '滑鼠', '耳機' ]
```

---

## 9. 階乘計算 (while + function)
### 【程式碼】

```javascript
function countFrequencies(items) {
  let counts = {}; 
  let i = 0;
  
  while (i < items.length) {
    let item = items[i];
    if (counts[item]) {
      counts[item]++;
    } else {
      counts[item] = 1;
    }
    i++;
  }
  return counts;
}

let words = ["apple", "banana", "apple", "orange", "banana", "apple"];

console.log(countFrequencies(words));

```

### 【輸出結果】
```
{ apple: 3, banana: 2, orange: 1 }
```

---

## 10. 終極魔王題：企業部門薪資統整 (全要素綜合應用)
### 【程式碼】

```javascript
function getHighEarnersData(companyJson) {
  let departments = JSON.parse(companyJson);
  let highEarners = [];
  let i = 0;
  
  while (i < departments.length) {
    let currentDept = departments[i];
    let employees = currentDept.employees;
    
    for (let j = 0; j < employees.length; j++) {
      if (employees[j].salary > 60000) {
        highEarners.push({
          name: employees[j].name,
          department: currentDept.department
        });
      }
    }
    i++;
  }
  
  return JSON.stringify(highEarners);
}

let companyJsonString = `[
  {
    "department": "IT",
    "employees": [{ "name": "John", "salary": 70000 }, { "name": "Jane", "salary": 50000 }]
  },
  {
    "department": "HR",
    "employees": [{ "name": "Bob", "salary": 65000 }]
  }
]`;

console.log(getHighEarnersData(companyJsonString));
```

### 【輸出結果】
```
'[{"name":"John","department":"IT"},{"name":"Bob","department":"HR"}]'
```