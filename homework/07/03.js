const posts = [{id: 1, t: "A"}, {id: 2, t: "B"}];
let html = "";

// 使用 forEach 遍歷陣列，並將 HTML 字串累加到 html 變數中
posts.forEach(post => {
  html += `<div>${post.t}</div>`;
});

console.log(html); 
// 輸出結果: <div>A</div><div>B</div>