# Kai Studio

## 專案簡介
Kai Studio 是一個前後端分離的個人數位平台，支援使用者個人頁面、筆記與文章管理，並預留未來功能擴展空間。

## 技術選型（暫定）
- Backend: FastAPI
- Frontend: Vue 3
- Database: PostgreSQL
- Reverse Proxy: Nginx
- Container: Docker

## 部署備註
- 前端：部署在 Cloudflare Pages
- 後端：部署在個人伺服器，使用 Cloudflare 隧道作為反向代理


## v1 功能目標
- 使用者註冊 / 登入
- 個人頁面（私人 / 公開）
- 筆記與文章 CRUD
- 文章可見性設定
- 主站顯示文章

## 未來功能 / 擴展想法
- 個人飲食紀錄 / 運動紀錄 / 習慣追蹤
- 購物頁面與訂單系統
- 即時聊天 / 社交追蹤 / 即時通知
- 搜尋、推薦系統
- 多媒體內容管理（圖片、影片）

## 專案狀態
- WIP（Work in Progress）: 正在開發中
- v1 功能優先完成，後續再加入其他功能

## 專案資料夾結構（初步）
```
kai-studio/
├─ backend/      # FastAPI 後端程式
│  ├─ api/       # 各種 API 模組
│  ├─ models/    # 資料庫模型
│  └─ main.py    # 後端入口
├─ frontend/     # Vue 前端程式
│  ├─ components/
│  ├─ pages/
│  └─ main.js
├─ docs/         # 架構與設計文件 / 部署說明
└─ README.md     # 專案說明
```