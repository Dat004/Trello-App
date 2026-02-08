import { useEffect, useState } from 'react';

/**
 * Hook để detect network status (online/offline)
 * 
 * Handles:
 * - WiFi/Ethernet disconnect
 * - Airplane mode
 * - Router down
 * - ISP issues
 * 
 * @returns {{ isOnline: boolean }}
 */
export function useNetworkStatus() {
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleOnline = () => {
            console.log('[Network] Online');
            setIsOnline(true);
        };

        const handleOffline = () => {
            console.log('[Network] Offline');
            setIsOnline(false);
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return { isOnline };
}
