# Kai-Studio: 個人化數位整合平台

這是一個以「個人」為核心、具備無限擴展可能的數位整合平台。專案從強大的區塊式筆記與知識分享出發，並透過模組化設計，預留了未來接入電商系統、健身追蹤、數據圖表等各種生活應用模組的空間。

## 🌟 平台核心哲學
- **模組化擴展**：不只是一個筆記軟體，而是可以根據需求掛載不同功能模組的個人中心。
- **知識與生活整合**：從個人的攻略筆記到日常的健身數據，都能在同一個生態系中管理。
- **情感與社群**：透過漂流瓶抒發心情，並藉由知識分享與審核機制，建立高品質的交流圈。
- **數據私有化**：建立屬於自己的數位足跡，為未來的數據分析與圖表產出提供基礎。

## 🛠 技術棧 (Current Selection)
- **前端 (Frontend)**: Vue 3 (Composition API), Vite, Tailwind CSS, Pinia, Editor.js
- **後端 (Backend)**: FastAPI, SQLAlchemy 2.0, PostgreSQL, Redis
- **基礎設施 (Infrastructure)**: Docker, Nginx, Cloudflare Tunnel

## 📂 開發文件導覽 (Development Docs)
在開始實作前，已完成完整的架構規劃，文件存放於 `/docs`：
1. [產品需求文件 (PRD)](./docs/PRD_v1.1.md)
2. [技術架構表 (Tech Stack)](./docs/Tech_Stack_v1.0.md)
3. [資料庫實體關係圖 (ERD)](./docs/ERD_v1.1.md)
4. [API 規格書 (API Spec)](./docs/API_Spec_v1.3.md)
5. [UI 邏輯與組件結構 (UI Logic)](./docs/UI_Logic_v1.0.md)

## 📈 專案開發進度 (Development Roadmap)

### Phase 1: 規格定義與架構設計
- [x] **1.1 需求分析**：完成 PRD 核心功能定義。
- [x] **1.2 技術選型**：確定前後端框架與資料庫。
- [x] **1.3 資料建模**：完成 ERD 資料表關聯設計。
- [x] **1.4 通訊規劃**：完成 API Spec 與 UI 邏輯架構。

### Phase 2: 開發環境與框架建置 (Current Focus)
- [ ] **2.1 基礎設施**：編寫 `docker-compose.yml` (啟動 Postgres, Redis)。
- [ ] **2.2 後端骨架**：FastAPI 目錄結構初始化與資料庫連線設定。
- [ ] **2.3 前端骨架**：Vue 3 專案初始化與路由系統設定。
- [ ] **2.4 自動化遷移**：設定 Alembic 資料庫版本控管。

### Phase 3: 核心功能與模組化開發 (Modular Iteration)
- [ ] **3.1 認證模組**：註冊、登入、雙 Token 驗證、信箱驗證流。
- [ ] **3.2 內容模組**：Editor.js 整合、知識分享與審核系統。
- [ ] **3.3 互動模組**：WebSocket 聊天室、匿名漂流瓶。
- [ ] **3.4 擴充模組預留**：電商原型、健身紀錄器、數據可視化圖表 (規劃中)。

### Phase 4: 優化與部署
- [ ] **4.1 效能優化**：前端骨架屏、後端 API 快取。
- [ ] **4.2 部署實作**：Cloudflare Tunnel 設定、Nginx 反向代理配置。

## 📂 專案資料夾結構
```text
.
├── backend/      # FastAPI 後端服務
├── frontend/     # Vue 3 前端專案
├── docs/         # 開發規格與設計文件庫
└── README.md     # 專案概覽與進度追蹤
```