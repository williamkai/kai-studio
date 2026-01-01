# 📄 API 規格書 (V1.1 - 2026 更新版)

## 1. 認證與用戶管理 (Auth & User API)
| 方法 | 路徑 | 說明 | 關鍵參數 / 備註 |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/v1/users/register` | 使用者註冊 | {email, password} (初始化 Permissions) |
| **GET** | `/api/v1/users/verify` | 驗證信箱 Token | Query: ?token=XYZ (啟用 is_active) |
| **POST** | `/api/v1/users/resend-verify` | 重新發送驗證郵件 | 需串接 Resend 服務 |
| **POST** | `/api/v1/auth/login` | 登入並發放雙 Token | {email, password, device_name} |
| **POST** | `/api/v1/auth/refresh` | 刷新 Access Token | Header: Refresh-Token |
| **GET** | `/api/v1/auth/devices` | 查看目前登入中的設備清單 | 顯示 IP、設備名、最後活動時間 |
| **DELETE** | `/api/v1/auth/devices/{id}` | 強制登出指定設備 | 廢除特定裝置的 Session |
| **POST** | `/api/v1/auth/logout` | 登出當前設備 | 清除 Refresh Token 紀錄 |

---

## 2. 筆記與審核流 (Note & Audit API)
| 方法 | 路徑 | 說明 | 權限要求 |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/v1/notes` | 獲取筆記列表 (含分頁/搜尋) | 公開內容或本人私有內容 |
| **POST** | `/api/v1/notes` | 建立新筆記 (Editor.js JSON) | `can_post_note = True` |
| **GET** | `/api/v1/notes/{id}` | 獲取單篇筆記與歷史版本清單 | 權限檢查 (私有/個人/全站) |
| **PATCH** | `/api/v1/notes/{id}` | 更新筆記 (自動產生 History) | 作者本人 |
| **DELETE** | `/api/v1/notes/{id}` | 刪除筆記 (邏輯刪除) | 作者本人 |
| **POST** | `/api/v1/notes/{id}/apply-global`| 申請「全站公開」審核 | `sync_status` 轉為 1 (待同步) |

---

## 3. 社交與即時通訊 (Social & Chat API)
| 方法 | 路徑 | 說明 | 備註 |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/v1/social/profile/{uid}` | 獲取他人公開主頁資料 | 檢查 `is_profile_public` 狀態 |
| **POST** | `/api/v1/social/follow/{id}` | 追蹤 / 取消追蹤使用者 | 修改 `follows` 表 |
| **GET** | `/api/v1/chat/rooms` | 獲取所有私訊對話清單 | 包含最後訊息與未讀數 |
| **GET** | `/api/v1/chat/{room_id}/history` | 獲取歷史訊息 | 支援顯示「已編輯」狀態 |
| **POST** | `/api/v1/bottles/drop` | 扔出一個匿名漂流瓶 | 存入 `drift_bottles` |
| **GET** | `/api/v1/bottles/pick` | 隨機撈取漂流瓶 | 每日限額由後端控管 |

---

## 4. 超級管理員後台 (Admin Portal API)
*需通過 `is_superuser = True` 檢查*
| 方法 | 路徑 | 說明 | 功能 |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/v1/admin/users` | 獲取全站使用者清單 | 聯表查詢 Permissions 狀態 |
| **PATCH** | `/api/v1/admin/users/{id}/permissions` | 修改權限開關 | 調整 `is_banned`, `can_post_note` 等 |
| **GET** | `/api/v1/admin/pending-notes` | 獲取所有「待審核」的文章 | 篩選 `sync_status = 1` 的資料 |
| **POST** | `/api/v1/admin/notes/{id}/audit` | 執行審核動作 | 覆蓋 `published_content` 並歸零狀態 |
| **GET** | `/api/v1/admin/audit-logs` | 系統操作日誌查詢 | 紀錄管理員變更權限或審核軌跡 |

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