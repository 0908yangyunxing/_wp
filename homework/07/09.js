const contents = [
  "Very long content here", 
  "Another Very long content here", 
  "3rd Very long content here"
];

// 使用 map() 遍歷陣列，並將每個字串截斷加上 "..."
const truncatedContents = contents.map(text => {
  return text.slice(0, 10) + "...";
});

console.log(truncatedContents);
// 輸出結果: [ 'Very long ...', 'Another Ve...', '3rd Very l...' ]