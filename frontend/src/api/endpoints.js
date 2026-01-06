// src/api/endpoints.js
export const ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',         // 對應 /api/v1/auth/login
        REFRESH: '/auth/refresh',     // 你的後端是 /refresh，不是 /refresh-token
        LOGOUT: '/auth/logout',       // 對應 /api/v1/auth/logout
    },
    USER: {
        REGISTER: '/users',          // POST: 註冊
        VERIFY: '/users/verify',     // GET: 驗證
        ME: '/users/me',             // GET: 取得目前使用者資料
    },
    NOTES: {
        PUBLIC: '/notes/public',      // 公開筆記
        CREATE: '/notes/',            // 建立筆記 (POST)
        MY_NOTES: '/notes/me',        // 我的筆記 (GET)
        DETAIL: (id) => `/notes/${id}`, // 更新 (PATCH) 或 刪除 (DELETE)
    }
};