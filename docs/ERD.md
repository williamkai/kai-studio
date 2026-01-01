# 📊 ERD 資料庫實體關係定義 (V1.3 完整版)

## 1. 使用者、安全性與權限 (User & Auth)
| 資料表 | 欄位 (Field) | 類型 | 說明 |
| :--- | :--- | :--- | :--- |
| **users** | id, email, password_hash, is_active, verification_token, created_at | Int/UUID | **核心帳號**。`is_active` 驗證後開啟，`verification_token` 存驗證碼。 |
| **user_permissions**| user_id (FK), is_superuser, can_post_note, can_use_fitness, is_banned | FK | **權限管理**。與 User 一對一，負責功能開關與封鎖邏輯。 |
| **profiles** | user_id (FK), nickname, avatar, bio, is_profile_public | FK | **個人檔案**。可開關個人頁面存取權。 |
| **user_devices** | id, user_id (FK), refresh_token, device_name, last_ip, last_active | FK | **設備管理**。紀錄多設備登入狀態與 Token 綁定。 |
| **social_accounts** | id, user_id (FK), provider, provider_user_id | FK | **第三方登入**。儲存 Google/GitHub 綁定資訊。 |

## 2. 筆記與內容管理 (Note & Category)
| 資料表 | 欄位 (Field) | 類型 | 說明 |
| :--- | :--- | :--- | :--- |
| **categories** | id, name, parent_id | FK | **分類**。支援大類 > 子類（例如：學習筆記 > 程式開發）。 |
| **notes** | id, author_id, category_id, title, content_json, published_content, status, sync_status | FK | **主表**。**status**: 0-私有, 1-個人公開, 3-全站公開。<br>**sync_status**: 0-一致, 1-有異動待同步。 |
| **note_history** | id, note_id (FK), content_json, created_at | FK | **歷史快照**。單篇筆記僅保留最新 20 筆 (FIFO)。 |
| **tags** | id, name | String | **標籤**。名稱唯一。 |
| **note_tag_rel** | note_id (FK), tag_id (FK) | FK | **多對多橋接表**。 |

## 3. 社交、互動與通訊 (Social & Chat)
| 資料表 | 欄位 (Field) | 類型 | 說明 |
| :--- | :--- | :--- | :--- |
| **follows** | follower_id (FK), followed_id (FK), created_at | FK | **追蹤**。使用者追蹤關係。 |
| **comments** | id, note_id (FK), user_id (FK), parent_id, content, is_edited | FK | **評論**。parent_id 達成巢狀回覆。 |
| **messages** | id, sender_id (FK), receiver_id (FK), content, is_read, is_edited | FK | **私訊**。1-on-1 私訊系統。 |
| **drift_bottles** | id, sender_id (FK), content, is_anonymous, created_at | FK | **漂流瓶**。匿名社交核心資料。 |

## 4. 系統擴充模組 (Module Slots)
| 資料表 | 欄位 (Field) | 類型 | 說明 |
| :--- | :--- | :--- | :--- |
| **feature_fitness** | id, user_id (FK), data_json, log_date | FK | **健身模組**專用表。 |
| **feature_finance** | id, user_id (FK), amount, category, log_date | FK | **理財模組**專用表。 |

---

## 💡 核心邏輯備註 (Core Logic Notes)

### 1. 權限與初始化機制
- 註冊後立即建立 `user_permissions` 預設權限，但 `is_active` 需經信箱驗證。
- `user_permissions` 取代了舊版的 `user_features`（語意更精確）。

### 2. 雙版本審核機制
1. **編輯流**：作者編輯 `content_json` 時，個人空間即時顯示最新內容。
2. **全站同步**：
    - 若 `status = 3` (全站公開) 且 `content_json` 被修改，`sync_status` 轉為 **1 (待同步)**。
    - 全站公開區讀取 `published_content`，直到管理員審核通過覆蓋。
3. **自動回滾檢查**：
    - 若內容改回與 `published_content` 一致，`sync_status` 轉回 **0 (已同步)**。