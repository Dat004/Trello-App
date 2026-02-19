import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60, // 1 phút
            refetchOnWindowFocus: false, // Không tự động fetch lại khi switch tab
            retry: 1, // Số lần thử lại khi request lỗi
        },
    },
});
