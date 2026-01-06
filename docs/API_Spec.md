# 📄 API 規格書 (V1.4)

## 1. 認證與用戶管理 (Auth & Users API)
| 方法 | 路徑 | 說明 | 關鍵參數 / 備註 |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/v1/users/` | 使用者註冊 | `{email, password}` -> 發送驗證信 |
| **GET** | `/api/v1/users/verify` | 驗證信箱 Token | Query: `?token=...` -> 啟用 `is_active` |
| **POST** | `/api/v1/auth/login` | 登入並發放雙 Token | 回傳 `access`, `refresh`, `device_id`, `user` |
| **POST** | `/api/v1/auth/refresh` | 刷新 Access Token | 使用 `refresh_token` + `device_id` 換新 |
| **POST** | `/api/v1/auth/logout` | 設備登出 | 移除 Redis 中的 `refresh_token` |
| **GET** | `/api/v1/auth/devices` | 設備管理清單 | 顯示 `device_name` (UA 解析) 與最後登入 IP |

---

## 2. 筆記與審核流 (Notes API)
| 方法 | 路徑 | 說明 | 權限要求 |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/v1/notes/public` | 獲取「全站公開」列表 | 免登入 (僅限已審核內容) |
| **GET** | `/api/v1/notes/me` | 獲取「我的」所有筆記 | 需登入 (含私有/草稿) |
| **POST** | `/api/v1/notes/` | 建立新筆記 | 需登入且 `can_post_note = True` |
| **PATCH** | `/api/v1/notes/{id}` | 更新內容或狀態 | 作者本人 (自動標記 `sync_status=1`) |
| **DELETE** | `/api/v1/notes/{id}` | 刪除筆記 | 作者本人 |

---

## 3. 社交與即時通訊 (Social & Chat API)
| 方法 | 路徑 | 說明 | 備註 |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/v1/social/profiles/{uid}` | 獲取他人公開主頁 | 檢查 `is_profile_public` |
| **POST** | `/api/v1/social/follows/{id}` | 追蹤 / 取消追蹤 | 修改 `follows` 表 |
| **GET** | `/api/v1/chat/rooms` | 獲取私訊對話清單 | 支援 WebSocket 即時更新 |

---

## 4. 管理員後台 (Admin API)
*權限：`is_superuser = True`*
| 方法 | 路徑 | 說明 | 功能 |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/v1/admin/users` | 全站使用者管理 | 包含封鎖、權限調整 |
| **GET** | `/api/v1/admin/notes/pending` | 待審核清單 | 篩選 `sync_status = 1` |
| **POST** | `/api/v1/admin/notes/{id}/audit` | 審核通過 | 內容發佈至 `published_content` |

---

## 5. 統一回應格式 (Response Schema)
後端採用 `backend/app/schemas/common.py` 定義之標準格式：

### 成功回應 (200 OK)

```json
{
  "message": "SUCCESS_CODE",
  "data": { ...內容... }
}
```
### 錯誤回應 (4xx / 5xx)

```json
{
  "detail": "ERROR_CODE",
  "error_code": "ERR_XXX",
  "message": "可讀性的錯誤描述"
}
```