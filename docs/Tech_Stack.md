# 🛠️ Tech Stack 技術架構表 (V1.2)

## 1. 前端開發 (Frontend)
* **核心框架**：`Vue 3 (Composition API)`
    * *選型原因*：與 FastAPI 搭配極佳，非同步處理能力強，適合自學者快速上手且具備企業級效能。
* **建置工具**：`Vite` (提供極速的開發環境啟動速度)。
* **狀態管理**：`Pinia` (用於存放使用者登入狀態、權限快照、未讀通知數)。
* **路由管理**：`Vue Router` (處理個人頁面路徑、後台路徑等)。
* **UI 框架與樣式**：
    * **Tailwind CSS**：負責主要的響應式佈局 (Grid/Flex) 與自定義樣式。
    * **Element Plus**：負責複雜組件，如：後台管理表格、彈窗 (Modal)、日期選擇器。
* **文章編輯器**：`Editor.js` (輸出格式為結構化 JSON)。
* **網路請求**：`Axios` (攔截器處理 JWT Token 刷新與錯誤提示)。

---

## 2. 後端開發 (Backend)
* **核心框架**：`FastAPI` (Python 3.12+)
    * **技術特性**：原生支持 `async/await`，採用全異步驅動提升 I/O 併發效能。
* **資料庫 ORM**：`SQLAlchemy 2.0 (AsyncIO)`
    * 搭配 `asyncpg` 驅動，並利用 `selectinload` 解決異步環境下的 Lazy Loading 問題。
* **身分驗證**：`JWT (JSON Web Token)` + `bcrypt`
    * **雙 Token 策略**：Access Token (JWT) 搭配 Refresh Token (UUID in Redis)。
* **裝置解析**：`user-agents`
    * 用於從 Request Header 自動解析使用者設備 (OS、瀏覽器) 以進行安全審核。
* **非同步通訊**：`FastAPI WebSocket`
    * 實現即時聊天室與系統實時通知。
* **郵件系統**：`Resend Python SDK`
    * 取代傳統 SMTP，確保註冊驗證郵件的高送達率。

---

## 3. 資料儲存 (Data Storage)
* **主要資料庫**：`PostgreSQL 16 (Alpine)`
    * 處理核心帳號、權限與業務資料，並利用其內建「全文檢索」功能。
* **快取與緩衝**：`Redis 7 (Alpine)`
    * **套件**：使用 `redis.asyncio` 異步客戶端。
    * **功能**：儲存 Refresh Token 紀錄、API 請求限流 (Rate Limiting)。
* **管理工具**：`Adminer`
    * 輕量級資料庫管理介面，透過 Docker 同步啟動。

---

## 4. 部署與基礎設施 (DevOps)
* **容器化**：`Docker` & `Docker Compose`
    * 一鍵啟動 `fastapi-app`、`kai_db`、`kai_redis`、`kai_adminer`。
* **反向代理**：`Nginx`
    * 處理 SSL 憑證與負載平衡。
* **外網存取**：`Cloudflare Tunnel` (保障內網伺服器不暴露 Port)。
* **前端託管**：`Cloudflare Pages` (提升全球存取速度)。

---

## 5. API 開發規格 (Standard)
* **設計風格**：`RESTful API`。
* **自動化文檔**：`Swagger (docs)` / `ReDoc` (Redocly)。
* **跨域處理**：`CORSMiddleware` (精確限制前端來源網域)。