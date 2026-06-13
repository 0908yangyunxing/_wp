function getHighEarnersData(companyJson) {
  // 1. 將 JSON 轉為陣列
  let departments = JSON.parse(companyJson);
  
  // 2. 準備存放結果的空陣列
  let highEarners = [];
  
  let i = 0;
  // 3. 使用 while 走訪各部門
  while (i < departments.length) {
    let currentDept = departments[i];
    let employees = currentDept.employees;
    
    // 4. 使用 for 走訪每一位員工
    for (let j = 0; j < employees.length; j++) {
      
      // 5. 使用 if 判斷薪資
      if (employees[j].salary > 60000) {
        highEarners.push({
          name: employees[j].name,
          department: currentDept.department
        });
      }
    }
    i++;
  }
  
  // 6. 轉回 JSON 字串
  return JSON.stringify(highEarners);
}

// 測試結果
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
// 輸出: '[{"name":"John","department":"IT"},{"name":"Bob","department":"HR"}]'