// src/features/auth/api/authService.js
import apiClient from '@/api/apiClient';
import { ENDPOINTS } from '@/api/endpoints';
import config from '@/config';

const authService = {
    /**
     * 登入功能
     */
    login: async (email, password) => {
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

        // 1. 確保傳給後端的 key 是 email
        const response = await apiClient.post(ENDPOINTS.AUTH.LOGIN, {
            email,      // 對應 LoginRequest 的 email
            password,   // 對應 LoginRequest 的 password
        });

        // 2. 後端目前回傳 LoginResponse，裡面沒有 user 對象
        // 我們要在這裡「加工」一下，讓前端 Store 好收資料
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

    /**
     * 刷新 Token (對應後端 /api/v1/auth/refresh)
     */
    refresh: async () => {
        if (config.isMock) return { token: 'new-mock-token' };
        const response = await apiClient.post(ENDPOINTS.AUTH.REFRESH);
        return response.data;
    },

    /**
     * 登出功能
     */
    logout: async () => {
        if (config.isMock) return { success: true };
        return await apiClient.post(ENDPOINTS.AUTH.LOGOUT);
    }
};

export default authService;