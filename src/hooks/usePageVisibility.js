import { useCallback, useEffect, useState } from 'react';

/**
 * Track page visibility and inactive duration (sleep/wake, screen lock).
 * Does not treat ordinary tab switches as a refetch signal.
 *
 * @returns {{
 *   isVisible: boolean,
 *   lastVisibleTime: number,
 *   getInactiveDuration: () => number
 * }}
 */
export function usePageVisibility() {
    const [isVisible, setIsVisible] = useState(!document.hidden);
    const [lastVisibleTime, setLastVisibleTime] = useState(Date.now());

    const getInactiveDuration = useCallback(() => {
        return Date.now() - lastVisibleTime;
    }, [lastVisibleTime]);

    useEffect(() => {
        const handleVisibilityChange = () => {
            const visible = !document.hidden;
            setIsVisible(visible);
            setLastVisibleTime(Date.now());
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    return {
        isVisible,
        lastVisibleTime,
        getInactiveDuration
    };
}
