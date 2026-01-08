// src/features/users/api/userService.js
import apiClient from '@/api/apiClient';
import { ENDPOINTS } from '@/api/endpoints';

const userService = {
    /**
     * 註冊新帳號
     * @param {Object} userData - 包含 email, password
     * @param {string} turnstileToken - Cloudflare Turnstile 驗證 Token
     */
    register: async (userData, turnstileToken) => {
        // 將 turnstileToken 與 userData 合併再送給後端
        const payload = { ...userData, turnstileToken };
        const response = await apiClient.post(ENDPOINTS.USER.REGISTER, payload);
        return response.data;
    },

    /**
     * 驗證 Email
     * @param {string} token - 從 URL 取得的驗證碼
     */
    verifyEmail: async (token) => {
        const response = await apiClient.get(`${ENDPOINTS.USER.VERIFY}?token=${token}`);
        return response.data;
    }
};

export default userService;
