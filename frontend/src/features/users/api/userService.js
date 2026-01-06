import apiClient from '@/api/apiClient';
import { ENDPOINTS } from '@/api/endpoints';

const userService = {
    /**
     * 註冊新帳號
     * @param {Object} userData - 包含 email, password
     */
    register: async (userData) => {
        const response = await apiClient.post(ENDPOINTS.USER.REGISTER, userData);
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