// src/hooks/useTurnstile.jsx
import config from '@/config';
import { useCallback, useState } from 'react';
import { Turnstile } from 'react-turnstile';

export default function useTurnstile() {
    const [token, setToken] = useState('');

    const TurnstileWidget = useCallback(() => {
        return <Turnstile sitekey={config.turnstileSiteKey} onVerify={setToken} />;
    }, []);

    return { token, TurnstileWidget, setToken };
}
