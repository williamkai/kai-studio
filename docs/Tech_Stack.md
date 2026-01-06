# 🛠️ Tech Stack 技術架構表 (V1.5)

## 1. 前端開發 (Frontend)
* **核心框架**：React 18+ (Functional Components / Hooks)
    * 選型原因：組件化邏輯嚴謹，生態系強大，適合實作全異步響應式介面。
* **建置工具**：Vite (極速開發環境啟動與 HMR)。
* **狀態管理**：Zustand
    * 功能：輕量化管理使用者登入狀態、JWT Token、權限快照。
    * 特性：實作 **Storage Event 監聽**，達成跨分頁狀態自動同步。
* **路由管理**：React Router v6
    * 功能：處理三層路由保護 (Public/Private/Admin Route)。
* **UI 框架與樣式**：
    * **Tailwind CSS**：負責響應式佈局 (Grid/Flex) 與原子化樣式。
    * **CSS Variables**：定義全域設計系統 (Design Tokens)，支援 Dark / Light 模式切換。
    * **精緻組件**：自定義封裝 ThemeToggle (開關組件) 與響應式導覽列。
* **網路請求**：Axios
    * 封裝 `apiClient.js`：處理 BaseURL 配置、JWT Token 自動夾帶與 401 錯誤自動處理。

---

## 2. 後端開發 (Backend)
* **核心框架**：FastAPI (Python 3.12+)
    * 技術特性：原生支持 async/await，全異步驅動。
* **資料庫 ORM**：SQLAlchemy 2.0 (AsyncIO)
    * 搭配 `asyncpg` 驅動，實作全異步資料讀取。
* **身分驗證**：JWT (JSON Web Token) + Bcrypt
    * **雙 Token 策略**：Access Token (短期) 搭配 Refresh Token (長期)。
* **裝置解析**：`user-agents`
    * 從 Request Header 解析使用者設備名稱 (OS + Browser)，用於設備登入管理。
* **郵件系統**：SMTP 服務 / Resend SDK
    * 處理註冊驗證郵件發送，確保帳號激活流程安全。

---

## 3. 資料儲存 (Data Storage)
* **主要資料庫**：PostgreSQL 16
    * 儲存使用者核心資料、筆記內容、權限表。
* **快取與緩衝**：Redis 7
    * 套件：`redis.asyncio`。
    * 功能：**儲存 Refresh Token**、實作登出黑名單（未來擴充）與設備登入紀錄。
* **管理工具**：Adminer
    * 輕量級資料庫管理介面，透過 Docker 同步啟動。

---

## 4. 部署與基礎設施 (DevOps)
* **容器化**：Docker & Docker Compose
    * 一鍵啟動 `fastapi-app`、`postgres_db`、`redis_cache`。
* **反向代理與安全**：Cloudflare Tunnel
    * 隱藏伺服器真實 IP，保障內網安全性。
* **前端託管**：Cloudflare Pages
    * 自動化 CI/CD 部署，提供全球邊際網路存取。

---

## 5. API 開發規格 (Standard)
* **設計風格**：RESTful API。
* **命名準則**：代碼內部採單數 (User)，URL 進入點採複數 (/users)。
* **跨域處理**：`CORSMiddleware` 精確限制允許之網域來源。