# 📄 PRD 產品需求文件 (V1.3)

## 1. 專案概述
* **專案名稱**：個人化筆記與社交分享平台 (Kai Studio)
* **專案目標**：從個人筆記出發，逐步擴展至社交、即時通訊、生活紀錄（健身、理財）的綜合性平台。
* **技術核心**：前後端分離 (FastAPI + Vue 3)，全異步架構 (Async/Await)，強調「設計先行」與「安全管理」。

---

## 2. 角色權限與權限定義

### 2.1 超級管理員 (Superadmin)
* **角色識別**：user_permissions.is_superuser = True。
* **內容審核**：針對 sync_status = 1 (待同步) 的文章進行審核，通過後將 content_json 覆蓋至 published_content 並將狀態歸零。
* **使用者管理**：透過權限表停權違規者 (is_banned) 或手動調整特定功能權限。
* **分類管理**：維護全站大類與子類標籤。

### 2.2 一般註冊使用者 (Verified User)
* **帳號狀態**：is_active = True (需完成信箱驗證)。
* **個人空間**：管理私有 (0)、個人頁公開 (1)、或全站公開 (3) 的文章。
* **權限控管**：根據 user_permissions 狀態決定是否可發文 (can_post_note) 或使用模組。
* **互動權限**：追蹤他人、發送私訊、在公開文章留言。

### 2.3 訪客 (Visitor)
* **權限**：僅能存取全站公開筆記 (/api/v1/notes/public) 與他人公開之個人 Profile。

---

## 3. UI/UX 導覽與流程架構

### 3.1 響應式導覽列 (Navbar)
* **狀態 A (未登入)**：首頁 | 關於我 | 全站公開筆記 | 登入/註冊
* **狀態 B (已登入)**：首頁 | 全站公開筆記 | 個人空間 | 通知(鈴鐺) | 使用者選單
    * 使用者選單內含：個人資料設定、設備管理、管理後台(限Admin)、登出。

### 3.2 驗證與跳轉邏輯
* **驗證流**：使用者點擊信箱驗證連結後，後端驗證成功將導回前端登入頁並帶上成功狀態參數。
* **登入後**：預設跳轉至「個人空間 (Personal Workspace)」。

---

## 4. 核心功能細節

### 4.1 註冊與驗證流 (Auth Flow)
* **流程**：註冊 -> 系統產生 verification_token -> 寄送驗證連結 -> 使用者點擊 -> 更新 is_active=True 並初始化預設 user_permissions。

### 4.2 API 設計規範 (Restful Standard)
* **命名原則**：後端內部檔案與實體採單數 (note.py, user.py)，外部網址進入點採複數 (/notes, /users) 以符合業界標準。

### 4.3 內容雙版本與審核 (Note Syncing)
* **作者視角**：存取 /notes/me，編輯 content_json (草稿)。
* **訪客視角**：存取 /notes/public，讀取 published_content (正式發佈版)。
* **同步判定**：當作者修改 status=3 的文章，sync_status 自動標記為 1 (待同步)。

### 4.4 富文本編輯 (Editor)
* **編輯器選型**：Editor.js (JSON 結構化資料)。
* **版本控制**：系統自動保存最新 20 筆歷史 Snapshot (note_history)。

---

## 5. 技術指標需求
* **效能需求**：後端採用全異步 (AsyncIO) 驅動，支持高併發連接。
* **安全性需求**：密碼需經過 bcrypt 雜湊，API 存取需攜帶 JWT Access Token。
* **響應式需求**：完美適配手機、平板、桌機。