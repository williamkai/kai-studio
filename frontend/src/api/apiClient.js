// apiClient.js
import config from '@/config'; // 引入新的配置中心
import axios from 'axios';

const apiClient = axios.create({
    // 從 config 讀取 URL，不再寫死字串
    baseURL: config.apiBaseUrl,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    }
});

// 攔截器邏輯不變，這是全域通用的「夾帶 Token」機制
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default apiClient;