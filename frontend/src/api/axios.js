import axios from 'axios';

// 建立通訊實例
const api = axios.create({
    // Vite 代理設定會處理 /api 轉發到 http://localhost:8000
    baseURL: '/api/v1',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 回應攔截器：統一處理後端報錯
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // 這裡可以統一彈出錯誤訊息
        alert(error.response?.data?.detail || '網路連線失敗');
        return Promise.reject(error);
    }
);

export default api;