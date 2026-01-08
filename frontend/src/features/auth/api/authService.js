import apiClient from '@/api/apiClient';
import { ENDPOINTS } from '@/api/endpoints';
import config from '@/config';

const authService = {
    /**
    * 使用者登入
    * @param {Object} param0 - 登入資料
    * @param {string} param0.email - 使用者 Email
    * @param {string} param0.password - 密碼
    * @param {string} param0.turnstileToken - Turnstile 驗證 token
    * @returns {Object} - 包含 access_token, refresh_token, device_id, user 資訊
    */
    login: async ({ email, password, turnstileToken }) => {
        if (config.isMock) {
            console.log("正在使用模擬登入 (Mock Mode)...");
            await new Promise(resolve => setTimeout(resolve, 800));

            if (email === 'admin@example.com' && password === '1234') {
                return {
                    user: { name: 'Kai (管理員)', role: 'admin' },
                    token: 'mock-jwt-token-for-admin'
                };
            } else if (email === 'user@example.com' && password === '1234') {
                return {
                    user: { name: '小明', role: 'user' },
                    token: 'mock-jwt-token-for-user'
                };
            } else {
                throw new Error('帳號或密碼錯誤 (測試請用 admin/1234)');
            }
        }

        // 非 Mock 模式：傳入 turnstileToken
        const response = await apiClient.post(ENDPOINTS.AUTH.LOGIN, {
            email,                 // 對應 LoginRequest 的 email
            password,              // 對應 LoginRequest 的 password
            turnstile_token: turnstileToken // 新增
        });

        // 後端回傳資料加工成前端 Store 好用的格式
        const { access_token, user, refresh_token, device_id } = response.data;

        return {
            token: access_token,
            refreshToken: refresh_token,
            deviceId: device_id,
            user: {
                id: user.id,
                email: user.email,
                isSuperuser: user.is_superuser,
                role: user.is_superuser ? 'admin' : 'user'
            }
        };
    },

    refresh: async () => {
        if (config.isMock) return { token: 'new-mock-token' };
        const response = await apiClient.post(ENDPOINTS.AUTH.REFRESH);
        return response.data;
    },

    logout: async () => {
        if (config.isMock) return { success: true };
        return await apiClient.post(ENDPOINTS.AUTH.LOGOUT);
    }
};

export default authService;
