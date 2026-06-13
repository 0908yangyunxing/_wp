const req = { body: { title: "JS教學", content: "內容在此", author: "Gemini" } };
const { title, content } = req.body;
console.log(title, content); // 輸出: JS教學 內容在此