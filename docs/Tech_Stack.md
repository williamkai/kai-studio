# 🛠️ Tech Stack 技術架構表 (V1.3)

## 1. 前端開發 (Frontend)
* **核心框架**：Vue 3 (Composition API)
    * 選型原因：與 FastAPI 搭配極佳，適合自學者實作全異步響應式介面。
* **建置工具**：Vite (極速開發環境啟動)。
* **狀態管理**：Pinia (存放使用者登入狀態、JWT Token、權限快照)。
* **路由管理**：Vue Router (處理個人空間、公開筆記牆、管理後台路徑)。
* **UI 框架與樣式**：
    * Tailwind CSS：負責響應式佈局 (Grid/Flex) 與自定義 UI 樣式。
    * Element Plus：負責複雜組件，如：後台管理表格、彈窗、通知系統。
* **文章編輯器**：Editor.js (結構化 JSON 輸出，便於後端雙版本儲存)。
* **網路請求**：Axios (攔截器處理 401 自動刷新 Token 與錯誤回傳處理)。

---

## 2. 後端開發 (Backend)
* **核心框架**：FastAPI (Python 3.12+)
    * 技術特性：原生支持 async/await，採用全異步驅動提升 I/O 併發效能。
* **資料庫 ORM**：SQLAlchemy 2.0 (AsyncIO)
    * 搭配 asyncpg 驅動，實現全異步資料讀取與雙版本內容寫入。
* **身分驗證**：JWT (JSON Web Token) + bcrypt
    * 策略：Access Token (短期) 搭配數據庫驗證的設備指紋管理。
* **郵件系統**：Resend Python SDK
    * 取代傳統 SMTP，用於發送註冊驗證連結與系統安全通知。
* **非同步通訊**：FastAPI WebSocket
    * 用於實現 1-on-1 即時通訊與漂流瓶互動功能。

---

## 3. 資料儲存 (Data Storage)
* **主要資料庫**：PostgreSQL 16
    * 儲存核心帳號、權限、筆記與社交關聯資料。
* **快取與緩衝**：Redis 7
    * 套件：使用 redis.asyncio。
    * 功能：API 請求限流 (Rate Limiting) 與 Session 管理。
* **管理工具**：pgAdmin / DBeaver (本地管理) 與 Adminer (容器化輕量介面)。

---

## 4. 部署與基礎設施 (DevOps)
* **容器化**：Docker & Docker Compose
    * 一鍵編排開發環境：FastAPI、PostgreSQL、Redis、Adminer。
* **開發環境規範**：採用 .env 進行環境變數隔離 (Resend Key, Database URL)。
* **外網存取**：Cloudflare Tunnel (保障伺服器安全，不暴露實體 IP)。

---

## 5. API 開發規格 (Standard)
* **設計風格**：RESTful API 規範。
* **命名準則**：代碼內部採單數 (Note, User)，URL 進入點採複數 (/notes, /users) 以符合業界開發習慣。
* **自動化文檔**：Swagger (docs) / ReDoc，支持全異步測試請求。