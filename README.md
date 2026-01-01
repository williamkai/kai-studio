# Kai-Studio: 個人化數位整合平台

這是一個以「個人」為核心、具備無限擴展可能的數位整合平台。專案從強大的區塊式筆記與知識分享出發，並透過模組化設計，預留了未來接入電商系統、健身追蹤、數據圖表等各種生活應用模組的空間。

## 🌟 平台核心哲學
- **模組化擴展**：不只是一個筆記軟體，而是可以根據需求掛載不同功能模組的個人中心。
- **知識與生活整合**：從個人的攻略筆記到日常的健身數據，都能在同一個生態系中管理。
- **情感與社群**：透過漂流瓶抒發心情，並藉由知識分享與審核機制，建立高品質的交流圈。
- **數據私有化**：建立屬於自己的數位足跡，為未來的數據分析與圖表產出提供基礎。

## 🛠 技術棧 (Current Selection)
- **前端 (Frontend)**: Vue 3 (Composition API), Vite, Tailwind CSS, Pinia, Editor.js
- **後端 (Backend)**: FastAPI (Async), SQLAlchemy 2.0, PostgreSQL, Redis (Asyncio)
- **基礎設施 (Infrastructure)**: Docker, Nginx, Cloudflare Tunnel



## 📂 開發文件導覽 (Development Docs)
在開始實作前，已完成完整的架構規劃，文件存放於 `/docs`：
1. [產品需求文件 (PRD)](./docs/PRD.md)
2. [技術架構表 (Tech Stack)](./docs/Tech_Stack.md)
3. [資料庫實體關係圖 (ERD)](./docs/ERD.md)
4. [API 規格書 (API Spec)](./docs/API_Spec.md)
5. [UI 邏輯與組件結構 (UI Logic)](./docs/UI_Logic.md)

## 📈 專案開發進度 (Development Roadmap)

### Phase 1: 規格定義與架構設計 (Completed ✅)
- [x] **1.1 需求分析**：完成 PRD 核心功能定義。
- [x] **1.2 技術選型**：確定前後端框架與資料庫。
- [x] **1.3 資料建模**：完成 ERD 資料表關聯設計。
- [x] **1.4 通訊規劃**：完成 API Spec 與 UI 邏輯架構。

### Phase 2: 開發環境與框架建置 (Completed ✅)
- [x] **2.1 基礎設施**：完成 `docker-compose.yml` (Postgres, Redis, Adminer)。
- [x] **2.2 後端骨架**：FastAPI 全異步 (Async) 目錄結構初始化與資料庫連線設定。
- [x] **2.3 資料遷移**：實作自動化建表邏輯。

### Phase 3: 核心功能與模組化開發 (Current Focus 🚀)
- [ ] **3.1 認證模組 (後端完成)**：
    - [x] 全異步註冊流與權限自動初始化。
    - [x] 基於 Redis 的雙 Token (Access/Refresh) 驗證機制。
    - [x] 多設備 Session 狀態管理與 User-Agent 識別。
    - [ ] 前端登入/註冊頁面實作。
- [ ] **3.2 內容模組**：Editor.js 整合、知識分享與審核系統。
- [ ] **3.3 互動模組**：WebSocket 聊天室、匿名漂流瓶。
- [ ] **3.4 擴充模組預留**：健身紀錄器、數據可視化圖表。

### Phase 4: 優化與部署
- [ ] **4.1 效能優化**：前端骨架屏、後端 API 快取。
- [ ] **4.2 部署實作**：Cloudflare Tunnel 設定、Nginx 反向代理配置。

## 📂 專案資料夾結構
```text
.
├── backend/      # FastAPI 後端服務 (Native Async)
├── frontend/     # Vue 3 前端專案
├── docs/         # 開發規格與設計文件庫 (V1.2 更新)
└── README.md     # 專案概覽與進度追蹤
```
