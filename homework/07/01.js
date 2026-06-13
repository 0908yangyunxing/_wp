// 1. 宣告名為 post 的物件
const post = {
  id: 1,
  title: "Hello World",
  content: "Markdown content"
};

// 2. 使用「點符號 (Dot notation)」印出 title
console.log(post.title); 
// 輸出結果: Hello World

// 3. 使用「中括號 (Bracket notation)」印出 title
console.log(post["title"]); 
// 輸出結果: Hello World