# Kai-Studio: 個人化數位整合平台

這是一個以「個人」為核心、具備無限擴展可能的數位整合平台。專案從強大的區塊式筆記與知識分享出發，並透過模組化設計，預留了未來接入生活應用模組（如：健身追蹤、數據圖表）的空間。

## 🌟 平台核心哲學
- **模組化擴展**：不只是一個筆記軟體，而是可以掛載不同功能模組的個人中心。
- **雙版本內容管理**：「編輯草稿 / 已發佈內容」分離邏輯，確保公開內容的品質與安全。
- **全異步驅動**：後端採用全異步 (Native Async) 架構，追求極致的併發效能。

## 🛠 技術棧 (Current Selection)
- **前端 (Frontend)**: React 18, Vite, Tailwind CSS v4, Zustand, Axios, React Query
- **後端 (Backend)**: FastAPI (Async), SQLAlchemy 2.0, PostgreSQL, Redis (Asyncio)
- **基礎設施 (Infrastructure)**: Docker, Nginx, Cloudflare Tunnel

## 📂 開發文件導覽 (Development Docs)
文件存放於 `/docs`，均已根據 V1.3 最新規範更新：
1. [產品需求文件 (PRD)](./docs/PRD.md)
2. [技術架構表 (Tech Stack)](./docs/Tech_Stack.md)
3. [資料庫實體關係圖 (ERD)](./docs/ERD.md)
4. [API 規格書 (API Spec)](./docs/API_Spec.md)
5. [UI 邏輯與組件結構](./docs/UI_Logic.md)

## 📈 專案開發進度 (Development Roadmap)

### Phase 1: 規格定義與架構設計 (Completed ✅)
- [x] 需求分析與技術選型 (React + FastAPI)。
- [x] 資料建模 (ERD) 與 RESTful API 規範規劃。

### Phase 2: 開發環境與基礎建置 (Completed ✅)
- [x] Docker Compose 環境 (Postgres, Redis, Adminer)。
- [x] 後端 FastAPI 全異步目錄架構與自動化建表。
- [x] 前端 React + Tailwind v4 + Vite Proxy 設定。

### Phase 3: 核心功能與安全強化 (Current Focus 🚀)
- [x] **認證模組**：JWT 雙 Token、異步郵件驗證、多設備 Session 管理。
- [x] **權限系統**：前後端路由守衛 (Public/Private/Admin Route)。
- [x] **狀態同步**：Zustand 跨分頁登入狀態實時同步。
- [ ] **內容模組**：
    - [x] 筆記 CRUD 核心邏輯與權限隔離。
    - [x] 雙版本同步判定邏輯 (sync_status)。
    - [ ] Editor.js 前端編輯器整合與自動儲存。
- [ ] **互動模組**：WebSocket 即時聊天、匿名漂流瓶。

---

## 📝 待辦事項與未來優化 (Backlog)

### 🛡️ 安全性增強 (Security)
- [ ] **頻率限制 (Rate Limiting)**：針對註冊與發信 API 實作 IP 次數限制，防止惡意刷票。
- [ ] **防機器人驗證**：登入/註冊頁面整合 Cloudflare Turnstile 或圖像辨識驗證。
- [ ] **Cloudflare WAF**：設定外網安全保護規則，隱藏真實伺服器特徵。

### ⚙️ 系統維護 (Maintenance)
- [ ] **自動化清理任務**：定期刪除「超過 24 小時未驗證」的過期帳號資料。
- [ ] **日誌系統**：建立異步日誌紀錄，追蹤異常登入嘗試。

### 🚀 效能優化 (Performance)
- [ ] **Redis 快取**：針對熱門公開筆記實作快取層。
- [ ] **圖片處理**：實作圖片上傳壓縮與 WebP 格式轉換。

---

## 📂 專案資料夾結構

```text
.
├── backend/                # FastAPI 後端服務 (Native Async)
│   ├── app/
│   │   ├── api/v1/         # 路由入口 (auth, user, notes)
│   │   ├── core/           # Config, Security, Redis 連線
│   │   ├── crud/           # 資料庫增刪改查封裝
│   │   ├── models/         # SQLAlchemy 資料表定義
│   │   ├── schemas/        # Pydantic 資料驗證與標準格式
│   │   ├── services/       # 外部服務整合 (Email...)
│   │   └── main.py         # FastAPI 應用啟動點
│   └── docker-compose.yml  # 基礎設施編排
├── frontend/               # React 前端服務 (Vite)
│   ├── src/
│   │   ├── api/            # apiClient 攔截器與全域 Endpoints
│   │   ├── features/       # 功能導向模組 (auth, notes, users)
│   │   ├── layouts/        # 響應式佈局 (Main/Admin)
│   │   ├── pages/          # 路由對應頁面實體
│   │   └── store/          # Zustand 狀態管理
│   └── vite.config.js      # 開發伺服器與 Proxy 配置
└── docs/                   # 完整開發規範文件 (PRD, ERD, API Spec...)
```