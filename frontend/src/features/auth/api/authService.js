// 使用 @ 絕對路徑，再也不用數有幾個 ../
import apiClient from '@/api/apiClient';
import config from '@/config';

const authService = {
    /**
     * 登入功能
     */
    login: async (username, password) => {
        // 從配置中心讀取是否為模擬模式
        if (config.isMock) {
            // --- 模擬假資料邏輯 ---
            console.log("正在使用模擬登入 (Mock Mode)...");

            // 模擬網路延遲，讓你能看到按鈕「登入中...」的狀態
            await new Promise(resolve => setTimeout(resolve, 800));

            if (username === 'admin' && password === '1234') {
                return {
                    user: { name: 'Kai (管理員)', role: 'admin' },
                    token: 'mock-jwt-token-for-admin'
                };
            } else if (username === 'user' && password === '1234') {
                return {
                    user: { name: '小明', role: 'user' },
                    token: 'mock-jwt-token-for-user'
                };
            } else {
                throw new Error('帳號或密碼錯誤 (測試請用 admin/1234)');
            }
        } else {
            // --- 真實連線邏輯 ---
            // 當 config.isMock = false 時，會跑這裡
            const response = await apiClient.post('/auth/login', { username, password });
            return response.data;
        }
    },

    /**
     * 登出功能
     */
    logout: async () => {
        if (config.isMock) return { success: true };
        return await apiClient.post('/auth/logout');
    }
};

export default authService;