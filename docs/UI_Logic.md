# 📄 UI 邏輯與組件結構 (V1.1 - 2026 同步版)

## 1. 專案目錄結構 (Folder Structure)
保持原定模組化結構，強調 `api/` 需與後端 `v1` 路由對齊。核心邏輯將封裝於 `stores/`（Pinia）與 `utils/`（Axios 攔截器）中，確保身分驗證邏輯全域統一。

```text
src/
├── api/            # 封裝 Axios 請求 (auth.js, users.js, notes.js)
├── stores/         # Pinia 狀態管理 (auth.js 儲存 user_id, device_id, access_token)
├── utils/          # 共用工具 (axios_instance.js 實作自動刷新邏輯)
└── views/
    ├── auth/       # 登入、註冊、設備管理 (New)
    └── ...
```

---

## 2. 佈局邏輯 (Layout Strategy)
* **App Layout**: 側邊欄應根據 `user_permissions` 動態顯示模組按鈕。
* **設備管理介面**: 在使用者選單中新增「登入設備管理」頁面，串接 `/auth/devices` API。

---

## 3. 前端權限守衛 (Navigation Guards)
在 `router/index.js` 中實作：
1. **登入檢查**: 檢查 Pinia 中的 `access_token`。若無，檢查 `localStorage` 裡的 `refresh_token`。
2. **設備驗證**: 每次登入時生成或讀取 `device_id` 並傳送至後端。

---

## 4. 核心組件開發邏輯
### 4.1 設備管理組件 (DeviceManager.vue)
* **功能**: 列出所有登入中的裝置（解析自後端 `user-agents` 資料）。
* **互動**: 提供「強制踢除」按鈕，呼叫 `DELETE /auth/devices/{id}`。

### 4.2 區塊編輯器 (Editor.vue)
* **Auto-save**: 配合後端異步特性，實作 `Loading` 狀態提示，確保 JSON 寫入成功。

---

## 5. UI 交互細節 (UX Enhancements)
### 5.1 無感 Token 刷新 (Silent Refresh)
* **攔截器邏輯**:
    1. 當 Axios 收到 `401 Unauthorized` 錯誤。
    2. 自動從 Store 提取 `{user_id, device_id, refresh_token}`。
    3. 呼叫 `POST /auth/refresh` 進行異步刷新。
    4. 成功後更新 Store 並重發原本失敗的請求；失敗則清除狀態並跳轉至 `/login`。

### 5.2 響應式設備識別
* 登入時前端可傳送自定義 `device_name`（如：我的工作筆電），若無則由後端自動解析 Request Header。

### 5.3 骨架屏 (Skeleton Screens)
* 針對筆記列表與社交動態牆進行佔位渲染，提升非同步數據加載時的視覺流暢感。