# 📊 ERD 資料庫實體關係定義 (V1.5)

## 1. 使用者、安全性與權限 (User & Auth)
| 資料表 | 欄位 (Field) | 類型 | 說明 |
| :--- | :--- | :--- | :--- |
| **users** | id, email, password_hash, is_active, verification_token, created_at | BigInt/UUID | **核心帳號**。is_active 驗證後開啟，verification_token 存驗證碼。 |
| **user_permissions**| user_id (FK), is_superuser, can_post_note, can_use_fitness, is_banned | FK | **權限管理**。與 User 一對一，負責功能開關與封鎖邏輯。 |
| **profiles** | user_id (FK), nickname, avatar, bio, is_profile_public | FK | **個人檔案**。可開關個人頁面存取權。 |
| **user_devices** | id, user_id (FK), device_id, device_name, last_ip, is_active, last_login, last_logout, last_active | FK | **Session 管理**。紀錄設備登入狀態、IP 與登出時間日誌。 |

---

## 2. 筆記與內容管理 (Note & Category)
| 資料表 | 欄位 (Field) | 類型 | 說明 |
| :--- | :--- | :--- | :--- |
| **categories** | id, name, parent_id | FK | **分類**。支援大類 > 子類（例如：學習筆記 > 程式開發）。 |
| **notes** | id, author_id, category_id, title, content_json, published_content, status, sync_status | FK | **主表**。**status**: 0-私有, 1-個人公開, 3-全站公開。<br>**sync_status**: 0-一致, 1-有異動待同步(待審核)。 |
| **note_history** | id, note_id (FK), content_json, created_at | FK | **歷史快照**。單篇筆記僅保留最新 20 筆 (FIFO)。 |
| **tags** | id, name | String | **標籤**。名稱唯一。 |
| **note_tag_rel** | note_id (FK), tag_id (FK) | FK | **多對多橋接表**。 |

---

## 3. 社交、互動與通訊 (Social & Chat)
| 資料表 | 欄位 (Field) | 類型 | 說明 |
| :--- | :--- | :--- | :--- |
| **follows** | follower_id (FK), followed_id (FK), created_at | FK | **追蹤**。使用者追蹤關係。 |
| **comments** | id, note_id (FK), user_id (FK), parent_id, content, is_edited | FK | **評論**。parent_id 達成巢狀回覆。 |
| **messages** | id, sender_id (FK), receiver_id (FK), content, is_read, is_edited | FK | **私訊**。1-on-1 私訊系統。 |

---

## 💡 核心邏輯備註 (Core Logic Notes)

### 1. 權限與初始化機制
- 註冊後立即建立 `user_permissions` 預設權限，但 `is_active` 需經信箱驗證。

### 2. 雙版本審核機制 (已於 CRUD 實作)
1. **編輯流**：作者透過 `PATCH /notes/{id}` 修改 `content_json`。
2. **待同步判定**：
    - 條件：若 `status = 3` (全站公開) 且 `content_json != published_content`。
    - 結果：`sync_status` 自動轉為 **1 (待同步)**。
3. **公開區讀取**：
    - `GET /notes/public` 僅撈取 `status=3` 且 `published_content` 有值的資料。
4. **管理員審核 (待實作)**：
    - 審核通過後，將 `content_json` 寫入 `published_content` 並重置 `sync_status = 0`。

### 3. Session 管理邏輯
- 每個登入動作會記錄於 `user_devices`。
- **登出時**：不刪除該筆資料，而是將 `is_active` 設為 `False` 並更新 `last_logout`。