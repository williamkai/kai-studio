# 📄 UI 邏輯與組件結構 (V1.0)

## 1. 專案目錄結構 (Folder Structure)
為了確保專案具備高維護性，建議在 src 目錄下採用以下模組化目錄結構：

```text
src/
├── api/            # 對應 API 規格書，封裝 Axios 請求 (auth.js, notes.js)
├── assets/         # 靜態資源、Tailwind 全域樣式
├── components/     # 全域共用組件 (如：CustomButton, Modal, Loading)
├── layouts/        # 頁面外殼 (Layouts)
│   ├── Default.vue # 訪客/首頁用
│   ├── App.vue     # 登入後個人空間用
│   └── Admin.vue   # 管理員後台用
├── stores/         # Pinia 狀態管理 (user.js, auth.js, note_drafts.js)
├── utils/          # 共用工具函式 (時間格式化、Token 解析)
└── views/          # 實際頁面內容
    ├── auth/       # 登入、註冊、驗證信箱
    ├── dashboard/  # 個人儀表板、個人文章列表
    ├── notes/      # 筆記編輯器 (Editor)、版本歷史
    ├── social/     # 好友列表、聊天視窗、漂流瓶
    └── admin/      # 管理員使用者管理、審核列表
```

---

## 2. 佈局邏輯 (Layout Strategy)
利用 Vue Router 的嵌套路由 (Nested Routes) 來達成不同頁面的外殼切換。

* **Default Layout**: 包含全域導覽列 (Navbar) 與頁尾 (Footer)。
* **App Layout**: 包含側邊功能選單 (Sidebar)，提供：我的筆記、聊天室、健身紀錄入口。
* **Admin Layout**: 具備管理員專屬的數據看板導覽與權限警告提示。

---

## 3. 前端權限守衛 (Navigation Guards)
在 `router/index.js` 中實作以下自動化檢查邏輯：

1.  **登入檢查 (Require Auth)**: 若進入私有路徑但 `token` 已失效，自動重導向至 `/login`。
2.  **信箱驗證檢查 (Require Verified)**: 
    * 若 `is_verified` 為 False，除驗證提醒頁面外，限制存取「發布文章」與「社交功能」。
3.  **管理員權限 (Admin Only)**:
    * 檢查 `is_superuser` 標籤，若非管理員嘗試存取 `/admin` 則跳轉至 403 頁面。

---

## 4. 核心組件開發邏輯

### 4.1 區塊編輯器 (Editor.vue)
* **整合**: 封裝 Editor.js 工具。
* **邏輯**: 
    * 組件載入時，從 API 抓取 JSON 渲染。
    * 實作 Auto-save 機制：使用 `lodash.debounce` 避免頻繁儲存，每 3 秒自動同步至後端。

### 4.2 即時通訊組件 (ChatBox.vue)
* **WebSocket**: 在組件 `onMounted` 時建立連線。
* **狀態**: 
    * 收到新訊息時，自動推入 `messages` 陣列。
    * 訊息物件需包含 `is_edited` 狀態，若後端傳送編輯訊號，同步更新 UI。

### 4.3 遞迴留言 (Comment.vue)
* **設計**: 組件自我調用 (Recursive Component)。
* **權限**: 判斷 `current_user_id == note_author_id`，若是則在 UI 標註「板主」。

---

## 5. UI 交互細節 (UX Enhancements)
* **Token 刷新**: 利用 Axios Interceptors (攔截器)。當收到 401 錯誤時，自動呼叫 `/refresh` 並重發原請求，達到「無感登入」。
* **響應式斷點**: 
    * 手機端 (Mobile): 隱藏 Sidebar，改為底欄按鈕或抽屜式選單。
    * 平板與桌機 (Desktop): 顯示完整 Sidebar，編輯器進入寬螢幕模式。
* **骨架屏 (Skeleton Screens)**: 文章加載時顯示灰影佔位塊，提升視覺流暢感。