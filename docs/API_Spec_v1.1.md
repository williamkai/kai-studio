# 📄 API 規格書 (V1.0 )

## 1. 認證與設備管理 (Auth & Device API)
| 方法 | 路徑 | 說明 | 關鍵參數 |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/register` | 使用者註冊 | {email, password} |
| **GET** | `/api/auth/verify-email` | 驗證信箱 Token | URL Token 驗證流 (開通 is_verified) |
| **POST** | `/api/auth/resend-verify` | 重新發送驗證郵件 | 限制發送頻率 |
| **POST** | `/api/auth/login` | 登入並發放雙 Token | {email, password, device_name} |
| **POST** | `/api/auth/refresh` | 刷新 Access Token | Header: Refresh-Token |
| **GET** | `/api/auth/devices` | 查看目前登入中的設備清單 | Auth: Access Token |
| **DELETE** | `/api/auth/devices/{id}` | 遠端強制登出指定設備 | 廢除該裝置的 Refresh Token |
| **POST** | `/api/auth/logout` | 登出當前設備 | 清除當前 Session |

---

## 2. 筆記與審核流 (Note & Audit API)
| 方法 | 路徑 | 說明 | 權限要求 |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/notes` | 獲取筆記列表 (含分頁/搜尋) | 根據使用者 ID 或公開狀態過濾 |
| **POST** | `/api/notes` | 建立新筆記 (Editor.js JSON) | 需已登入並驗證信箱 |
| **GET** | `/api/notes/{id}` | 獲取單篇筆記與歷史版本清單 | 權限檢查 (私有/個人/全站) |
| **PATCH** | `/api/notes/{id}` | 更新筆記 (自動產生 History) | 作者本人 |
| **DELETE** | `/api/notes/{id}` | 刪除筆記 (邏輯刪除) | 作者本人 |
| **POST** | `/api/notes/{id}/apply-global`| 申請「全站公開」審核 | 狀態轉為 Pending |

---

## 3. 社交與即時通訊 (Social & Chat API)
| 方法 | 路徑 | 說明 | 備註 |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/social/profile/{uid}` | 獲取他人公開主頁資料 | 檢查 is_profile_public 狀態 |
| **POST** | `/api/social/follow/{id}` | 追蹤 / 取消追蹤使用者 | 切換追蹤狀態 |
| **GET** | `/api/chat/rooms` | 獲取當前所有私訊對話清單 | 顯示最後一條訊息與未讀數 |
| **GET** | `/api/chat/{room_id}/history`| 獲取指定對話的歷史訊息 | 支援顯示「已編輯」標籤 |
| **POST** | `/api/bottles/drop` | 扔出一個匿名漂流瓶 | 可設定是否允許他人回覆 |
| **GET** | `/api/bottles/pick` | 隨機從池中撈取漂流瓶 | 每日限制撈取次數 |

---

## 4. 超級管理員後台 (Admin Portal API)
*僅限 `is_superuser = True` 使用*
| 方法 | 路徑 | 說明 | 功能 |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/admin/users` | 獲取全站使用者清單 | 包含設備數、文章數、帳號狀態 |
| **PATCH** | `/api/admin/users/{id}` | 管理使用者權限與狀態 | 停權 (is_active) 或 提權 (is_superuser) |
| **GET** | `/api/admin/pending-notes` | 獲取所有「待審核」的文章 | 列表顯示，包含申請人資訊 |
| **POST** | `/api/admin/notes/{id}/audit` | 執行審核動作 | {action: "approve/reject", reason: "..."} |
| **GET** | `/api/admin/audit-logs` | 系統操作日誌查詢 | 紀錄管理員的操作軌跡 (審計用) |

---

## 5. 共通回應格式 (Response Standard)
```json
{
  "status": "success",
  "message": "操作描述",
  "data": { ... 實際 Payload ... },
  "error_code": null
}
```