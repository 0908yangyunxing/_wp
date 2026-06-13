function getPassingStudents(students) {
  let passingNames = [];
  
  for (let i = 0; i < students.length; i++) {
    // 判斷該學生「物件」內的 score 是否大於等於 60
    if (students[i].score >= 60) {
      passingNames.push(students[i].name);
    }
  }
  return passingNames;
}

// 測試結果
const studentList = [
  { name: "小明", score: 55 },
  { name: "小華", score: 80 },
  { name: "小美", score: 95 }
];
console.log(getPassingStudents(studentList)); // 輸出: ["小華", "小美"]