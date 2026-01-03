# Kai-Studio: 個人化數位整合平台

這是一個以「個人」為核心、具備無限擴展可能的數位整合平台。專案從強大的區塊式筆記與知識分享出發，並透過模組化設計，預留了未來接入生活應用模組（如：健身追蹤、數據圖表）的空間。

## 🌟 平台核心哲學
- **模組化擴展**：不只是一個筆記軟體，而是可以掛載不同功能模組的個人中心。
- **雙版本內容管理**：獨創「編輯草稿 / 已發佈內容」分離邏輯，確保公開內容的品質與安全。
- **全異步驅動**：後端採用全異步 (Native Async) 架構，追求極致的併發效能。

## 🛠 技術棧 (Current Selection)
- **前端 (Frontend)**: React 18, Vite, Tailwind CSS v4, Zustand (狀態管理), Axios, React Query
- **後端 (Backend)**: FastAPI (Async), SQLAlchemy 2.0, PostgreSQL, Redis (Asyncio)
- **基礎設施 (Infrastructure)**: Docker, Nginx, Cloudflare Tunnel

## 📂 開發文件導覽 (Development Docs)
文件存放於 `/docs`，均已根據 V1.3 最新規範更新：
1. [產品需求文件 (PRD)](./docs/PRD.md)
2. [技術架構表 (Tech Stack)](./docs/Tech_Stack.md)
3. [資料庫實體關係圖 (ERD)](./docs/ERD.md)
4. [API 規格書 (API Spec)](./docs/API_Spec.md)

## 📈 專案開發進度 (Development Roadmap)

### Phase 1: 規格定義與架構設計 (Completed ✅)
- [x] **1.1 需求分析**：完成 PRD 核心功能定義。
- [x] **1.2 技術選型**：確定前後端框架與資料庫（由 Vue 轉向 React 體系）。
- [x] **1.3 資料建模**：完成 ERD 資料表關聯設計。
- [x] **1.4 API 規範**：完成 RESTful 複數路徑與 API Spec 規劃。

### Phase 2: 開發環境與框架建置 (Completed ✅)
- [x] **2.1 基礎設施**：完成 Docker Compose (Postgres, Redis, Adminer) 建置。
- [x] **2.2 後端骨架**：FastAPI 全異步目錄結構初始化。
- [x] **2.3 資料遷移**：實作自動化建表與異步連線。
- [x] **2.4 前端架構**：React + Tailwind v4 環境初始化、Vite Proxy 代理設定。

### Phase 3: 核心功能與模組化開發 (Current Focus 🚀)
- [x] **3.1 認證模組 (後端)**：註冊、登入、異步信箱驗證、多設備 Session 管理。
- [ ] **3.2 內容模組 (進行中)**：
    - [x] 筆記 CRUD 核心邏輯 (Create, Read, Update, Delete)。
    - [x] 權限隔離系統 (作者保護與 403 檢查)。
    - [x] 全站公開區 API (免登入讀取已發佈版本)。
    - [x] 雙版本同步判定邏輯 (sync_status)。
    - [ ] 前端 AuthStore (Zustand) 與 Axios 連線實作。
    - [ ] 前端 Editor.js 編輯器整合。
- [ ] **3.3 互動模組**：WebSocket 即時聊天、匿名漂流瓶。

### Phase 4: 優化與部署
- [ ] **4.1 效能優化**：Redis 快取常用筆記、前端骨架屏。
- [ ] **4.2 部署實作**：Cloudflare Tunnel 設定。

## 📂 專案資料夾結構
```text
.
├── backend/                # FastAPI 後端服務 (Native Async)
│   ├── app/
│   │   ├── api/v1/endpoints/  # API 路由入口 (複數路徑規範)
│   │   ├── core/              # 安全性、配置與 Redis 初始化
│   │   ├── crud/              # 資料庫增刪改查邏輯
│   │   ├── models/            # SQLAlchemy 資料模型
│   │   ├── schemas/           # Pydantic 資料驗證
│   │   └── main.py            # 應用程式入口
│   └── requirements.txt
├── frontend/               # React 前端專案
│   ├── src/
│   │   ├── api/            # API 請求封裝 (Axios)
│   │   ├── store/          # 全域狀態管理 (Zustand)
│   │   ├── components/     # 通用 UI 組件
│   │   ├── pages/          # 頁面級組件
│   │   └── index.css       # Tailwind v4 樣式入口
│   ├── vite.config.js      # Vite 配置 (含 Proxy)
│   └── package.json
├── docs/                   # 開發規格與設計文件庫
└── README.md               # 專案概覽與進度追蹤
```