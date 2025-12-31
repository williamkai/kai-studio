# 📊 ERD 資料庫實體關係定義 (V1.1 - 支援多設備與權限審核)

## 1. 使用者與安全性 (User & Auth)
| 資料表 | 欄位 (Field) | 類型 | 說明 |
| :--- | :--- | :--- | :--- |
| **users** | id, email, password_hash, is_active, is_superuser | UUID/Int | 核心帳號，Email 唯一 |
| **profiles** | user_id, nickname, avatar, bio, is_profile_public | FK | 個人檔案，可開關個人頁面存取權 |
| **user_devices** | id, user_id, refresh_token, device_name, last_ip, last_active | FK | **(新增)** 紀錄多設備登入狀態與 Token 綁定 |
| **social_accounts** | id, user_id, provider, provider_id | FK | 儲存 Google/GitHub 第三方綁定資訊 |

## 2. 筆記與內容管理 (Note & Category)
| 資料表 | 欄位 (Field) | 類型 | 說明 |
| :--- | :--- | :--- | :--- |
| **categories** | id, name, parent_id | FK | 支援大類 > 子類 (例如：學習筆記 > 程式開發) |
| **notes** | id, author_id, category_id, title, content_json, status | FK | status: 0-私有, 1-個人頁, 2-審核中, 3-全站公開 |
| **note_history** | id, note_id, content_json, created_at | FK | 儲存歷史版本 Snapshot，支援版本回溯 |
| **tags** | id, name | String | 標籤名稱唯一 |
| **note_tag_rel** | note_id, tag_id | FK | 多對多橋接表 (一個筆記可有多個標籤) |

## 3. 社交、互動與通訊 (Social & Chat)
| 資料表 | 欄位 (Field) | 類型 | 說明 |
| :--- | :--- | :--- | :--- |
| **follows** | follower_id, followed_id, created_at | FK | 使用者追蹤關係 |
| **comments** | id, note_id, user_id, parent_id, content, is_edited | FK | parent_id 達成巢狀回覆；紀錄是否編輯過 |
| **messages** | id, sender_id, receiver_id, content, is_read, is_edited | FK | 1-on-1 私訊，具備即時通訊狀態標記 |
| **drift_bottles** | id, sender_id, content, is_anonymous, created_at | FK | 匿名漂流瓶核心資料 |

## 4. 系統擴充插槽 (Module Slots)
| 資料表 | 欄位 (Field) | 類型 | 說明 |
| :--- | :--- | :--- | :--- |
| **user_features** | user_id, feature_name, is_enabled | FK | 控管使用者是否開啟健身、理財等進階模組 |
| **feature_fitness** | id, user_id, data_json, log_date | FK | 預留：健身模組專用表 |
| **feature_finance** | id, user_id, amount, category, log_date | FK | 預留：理財模組專用表 |