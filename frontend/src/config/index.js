// src/config/index.js
const config = {
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
    isMock: true, // 開發時設為 true，對接後端時改為 false
};

export default Object.freeze(config);