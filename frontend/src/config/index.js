// src/config/index.js
const config = {
    // 組合出 http://127.0.0.1:8000/api/v1
    apiBaseUrl: `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_API_PREFIX}`,
    isMock: import.meta.env.VITE_IS_MOCK === 'true',
    turnstileSiteKey: import.meta.env.VITE_TURNSTILE_SITE_KEY,

};

export default Object.freeze(config);