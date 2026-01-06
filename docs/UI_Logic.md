# 📄 UI 邏輯與組件結構 (V1.3)

## 1. 前端目錄架構 (Feature-based Structure)
專案採用「功能導向」架構，將 API 請求、組件與狀態按功能模組（如 auth, notes, users）進行歸類，提升開發維護效率。

```text
src/
├── api/                # 全域 Axios 實例與通用 Endpoints
├── components/         # 跨模組通用 UI 組件 (如 ThemeToggle)
├── features/           # 核心業務邏輯模組
│   ├── auth/           # 認證功能 (api, store, components)
│   ├── notes/          # 筆記功能
│   └── users/          # 使用者資料功能
├── layouts/            # 頁面佈局 (MainLayout, AdminLayout)
├── pages/              # 路由入口頁面 (Home, Login, Register...)
├── config/             # 環境變數與全域配置
└── utils/              # 工具函式
```

## 2. 佈局邏輯 (Layout Strategy)
* **Main Layout**: 使用 React Router 的 `<Outlet />` 實現巢狀佈局。導覽列 (Navbar) 需根據 Auth 狀態切換顯示「登入/註冊」或「使用者選單」。
* **Admin Layout**: 專為管理員設計的側邊欄導航，需通過 AdminRoute 權限檢查。
* **主題切換**: 整合 CSS Variables 與 Zustand 狀態，支援 Light / Dark 模式。

---

## 3. 前端路由與權限守衛 (React Router Guards)
在 `App.jsx` 中使用組件化守衛實作：
1. **PublicRoute**: 阻擋已登入使用者存取 `/login`, `/register`，自動跳轉至首頁。
2. **PrivateRoute**: 攔截未登入使用者存取受保護路徑，自動重定向至 `/login`。
3. **AdminRoute**: 額外檢查 `user.is_superuser` 權限。
4. **驗證邏輯**: 在應用程式根層級執行 Token 有效性檢查與設備 ID 綁定。

---

## 4. 核心組件開發邏輯 (React Logic)
### 4.1 帳號激活組件 (VerifyEmail.jsx)
* **API 交互**: 使用 `useEffect` 在頁面加載時執行激活請求。
* **狀態反饋**: 提供「驗證中」、「驗證成功」與「驗證失敗」三種 UI 狀態切換。

### 4.2 響應式導覽列 (Navbar.jsx)
* **動畫效果**: 手機版側邊欄整合動畫特效，優化收合體驗。
* **狀態監聽**: 監聽全域 Auth 狀態，動態渲染使用者頭像與角色選單。

---

## 5. UI 交互細節 (UX Enhancements)
### 5.1 無感 Token 刷新 (Silent Refresh)
* **Axios 攔截器**:
    1. 當回應為 `401 Unauthorized` 時觸發。
    2. 自動從 Store 提取 `refresh_token` 並請求 `/auth/refresh`。
    3. 成功後更新 Store 並自動重發原失敗請求；失敗則執行強迫登出。

### 5.2 跨分頁狀態同步 (Cross-tab Sync)
* **Storage 事件**: 監聽 `window.storage`，當使用者在其中一個分頁登出時，確保所有開啟的分頁同步跳轉至登入頁。

### 5.3 骨架屏與載入狀態
* 在 API 請求期間使用佔位組件，並在按鈕上加入 Loading 狀態防止重複點擊。