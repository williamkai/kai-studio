# 🛠️ Tech Stack 技術架構表 (V1.1)

## 1. 前端開發 (Frontend)
* **核心框架**：`Vue 3 (Composition API)`
    * *選型原因*：與 FastAPI 搭配極佳，非同步處理能力強，適合自學者快速上手且具備企業級效能。
* **建置工具**：`Vite` (提供極速的開發環境啟動速度)。
* **狀態管理**：`Pinia` (用於存放使用者登入狀態、權限快照、未讀通知數)。
* **路由管理**：`Vue Router` (處理個人頁面路徑、後台路徑等)。
* **UI 框架與樣式**：
    * **Tailwind CSS**：負責主要的響應式佈局 (Grid/Flex) 與自定義樣式。
    * **Element Plus**：負責複雜組件，如：後台管理表格、彈窗 (Modal)、日期選擇器、下拉選單。
* **文章編輯器**：`Editor.js`
    * 輸出格式為結構化 JSON，方便後端儲存、搜尋與未來移動端 (App) 擴展。
* **網路請求**：`Axios` (攔截器處理 JWT Token 刷新與錯誤提示)。

---

## 2. 後端開發 (Backend)
* **核心框架**：`FastAPI` (Python 3.12+)
    * *選型原因*：原生支援非同步 (async/await)，效能優於 Django，且自動生成 Swagger API 文檔。
* **資料庫 ORM**：`SQLAlchemy 2.0` (使用 Async 模式)
    * 支援複雜的關聯查詢（如好友關係、權限聯表、巢狀留言）。
* **身分驗證**：`JWT (JSON Web Token)` + `原生 bcrypt 雜湊`
    * **修正**：棄用過時的 passlib，改由 bcrypt 手動處理 byte 轉換，並使用 HttpOnly Cookie 存儲防止 XSS。
* **非同步通訊 (WebSocket)**：`FastAPI WebSocket`
    * 用於實現即時聊天室、漂流瓶通知與系統實時通知。
* **郵件系統**：`Resend Python SDK`
    * **修正**：取代傳統 SMTP，負責處理註冊驗證連結 (Verification Token) 的可靠發送。

---

## 3. 資料儲存 (Data Storage)
* **主要資料庫**：`PostgreSQL`
    * 處理核心帳號 (Users)、權限 (Permissions) 與業務資料，並利用其內建「全文檢索」達成搜尋文章。
* **快取與緩衝**：`Redis`
    * 儲存登入驗證、限制 API 請求頻率 (Rate Limiting) 與 Session 快取。
* **檔案儲存 (Media)**：
    * 初期：伺服器本地磁碟卷 (Docker Volume)。
    * 後期：可選配 S3 協議物件儲存（如 MinIO 或 AWS S3）。

---

## 4. 部署與基礎設施 (DevOps)
* **容器化**：`Docker` & `Docker Compose`
    * 統一開發與生產環境，一鍵啟動後端、資料庫、Redis。
* **反向代理與靜態資源**：`Nginx`
    * 處理 SSL 憑證、負載平衡，以及靜態圖片的加速存取。
* **外網存取**：`Cloudflare Tunnel`
    * 無需開放伺服器實體 Port，保障內網安全。
* **前端託管**：`Cloudflare Pages`
    * 達成前後端分離的物理隔離，提升前端全球加載速度。

---

## 5. API 開發規格 (Standard)
* **設計風格**：`RESTful API`。
* **自動化文檔**：`Swagger / ReDoc` (FastAPI 內建)。
* **跨域處理**：`CORSMiddleware` (精確限制允許的網域，如 Cloudflare Pages 來源)。