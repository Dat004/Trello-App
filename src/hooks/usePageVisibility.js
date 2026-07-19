import { useCallback, useEffect, useState } from 'react';

/**
 * Hook để detect page visibility và track inactive duration
 * 
 * Handles:
 * - Laptop sleep/wake (long inactivity > 5 minutes)
 * - Screen lock/unlock
 * 
 * NOTE: Không detect tab switching thông thường để tránh refetch không cần thiết
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

            if (visible) {
                const now = Date.now();
                const inactiveDuration = now - lastVisibleTime;

                console.log('[Visibility] Tab visible, inactive for:',
                    Math.floor(inactiveDuration / 1000), 's');

                setLastVisibleTime(now);
            } else {
                console.log('[Visibility] Tab hidden');
                setLastVisibleTime(Date.now());
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [lastVisibleTime]);

    return {
        isVisible,
        lastVisibleTime,
        getInactiveDuration
    };
}
