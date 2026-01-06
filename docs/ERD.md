# 📊 ERD 資料庫實體關係定義 (V1.6)

## 1. 使用者、安全性與權限 (User & Auth)
| 資料表 | 欄位 (Field) | 類型 | 說明 |
| :--- | :--- | :--- | :--- |
| **users** | id, email, password_hash, is_active, created_at | BigInt | **核心帳號**。`is_active` 驗證後開啟登入權限。 |
| **user_permissions**| user_id (FK), is_superuser, can_post_note, is_banned | FK | **權限管理**。負責功能開關與封鎖邏輯。 |
| **profiles** | user_id (FK), nickname, avatar, bio, is_profile_public | FK | **個人檔案**。管理個人頁面公開性。 |
| **user_devices** | id, user_id (FK), device_id, device_name, last_ip, last_login, last_logout | FK | **登入日誌**。紀錄設備識別碼 (UUID) 與登入歷史，用於安全審核。 |

> **Redis 儲存邏輯 (高速讀寫層)**：
> - `refresh_token:{user_id}:{device_id}`: 儲存對應的 Refresh Token，設有過期時間（如 7 天）。

---

## 2. 筆記與內容管理 (Note & Category)
| 資料表 | 欄位 (Field) | 類型 | 說明 |
| :--- | :--- | :--- | :--- |
| **categories** | id, name, parent_id | FK | **分類**。支援大類 > 子類（層級樹）。 |
| **notes** | id, author_id, category_id, title, content_json, published_content, status, sync_status | FK | **主表**。內容採 JSON 儲存，支援雙版本審核機制。 |
| **note_history** | id, note_id (FK), content_json, created_at | FK | **版本控制**。保留最新 20 筆快照。 |
| **tags** | id, name | String | **標籤**。名稱唯一。 |
| **note_tag_rel** | note_id (FK), tag_id (FK) | FK | **多對多橋接**。 |

---

## 3. 社交與互動 (Social & Chat)
| 資料表 | 欄位 (Field) | 類型 | 說明 |
| :--- | :--- | :--- | :--- |
| **follows** | follower_id (FK), followed_id (FK), created_at | FK | **追蹤關係**。 |
| **comments** | id, note_id (FK), user_id (FK), parent_id, content | FK | **評論系統**。支援巢狀回覆結構。 |
| **messages** | id, sender_id (FK), receiver_id (FK), content, is_read | FK | **私訊**。1-on-1 對話。 |

---

## 💡 核心運作邏輯

### 1. 設備登入與 Token 校驗流程
1. **登入時**：後端生成 `device_id` 並紀錄至 `user_devices` 表，同時將 `refresh_token` 存入 **Redis**。
2. **刷新時**：前端送出 `device_id` + `refresh_token`，後端校驗 Redis 內的值。
3. **登出時**：前端呼叫 `/logout` 並帶入 `device_id`，後端刪除 Redis 對應 Key 並更新 `user_devices` 的 `last_logout` 時間。

### 2. 雙版本內容審核 (Note Syncing)
- **草稿區**：`content_json` 永遠儲存作者最新的編輯內容。
- **發佈區**：`published_content` 儲存最後一次審核通過的內容。
- **同步偵測**：若 `status=3` 且 `content_json` 與 `published_content` 不一致，`sync_status` 自動設為 **1 (待同步)**。