// 1. 定義 checkAdmin 函數
function checkAdmin(role, callback) {
  if (role !== "admin") {
    // 當角色不是 admin 時，第一個參數傳入錯誤訊息
    callback("Access Denied");
  } else {
    // 當角色是 admin 時，第一個參數傳入 null 表示無錯誤，第二個參數傳入成功訊息
    callback(null, "Welcome");
  }
}

// 測試 1：模擬「非管理員」登入 (發生錯誤的狀況)
console.log("--- 測試 1: guest 登入 ---");
checkAdmin("guest", (err, message) => {
  if (err) {
    console.error("驗證失敗:", err);
  } else {
    console.log("驗證成功:", message);
  }
});
// 輸出結果: 驗證失敗: Access Denied


// 測試 2：模擬「管理員」登入 (沒有錯誤的狀況)
console.log("\n--- 測試 2: admin 登入 ---");
checkAdmin("admin", (err, message) => {
  if (err) {
    console.error("驗證失敗:", err);
  } else {
    console.log("驗證成功:", message);
  }
});
// 輸出結果: 驗證成功: Welcome