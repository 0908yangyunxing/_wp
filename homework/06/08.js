let listA = [1, 2];
let listB = [3, 4];

function process(a, b) {
  a.push(99);
  b = [100];
}
process(listA, listB);

//執行結果
// listA: [1, 2, 99]
// listB: [3, 4]

//在 JavaScript 中，
//純值（如字串、數字）是「傳值（Call by Value）」
//，而複雜的資料型別（如陣列、物件）則是透過「參照（Reference）」來傳遞的。
//更精確地說，函數接收到的是記憶體位址的拷貝（這在學術上常被稱為 Call by Sharing）。