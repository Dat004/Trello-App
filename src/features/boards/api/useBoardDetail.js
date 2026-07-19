import { boardApi } from '@/api/board';
import { BOARD_KEYS } from '@/query/queryKeys';
import { useQuery } from '@tanstack/react-query';

export { BOARD_KEYS };

export const useBoardDetail = (boardId) => {
    return useQuery({
        queryKey: BOARD_KEYS.detail(boardId),
        queryFn: async () => {
            const res = await boardApi.detailBoard(boardId);

            // Check success flag from backend response wrapper
            if (!res.data?.success) {
                const error = new Error(res.data?.message || 'Không thể tải thông tin bảng');
                error.status = res.status;
                // Attach full response data for handling redirects or specific error codes
                error.response = res.data;
                throw error;
            }

            return res.data.data;
        },
        enabled: !!boardId,
        // Cache for 5 minutes but allow background refetch
        staleTime: 1000 * 60 * 5,
        retry: (failureCount, error) => {
            // Don't retry on 403/404 errors as they are likely permanent
            if (error.status === 403 || error.status === 404) return false;
            return failureCount < 2;
        }
    });
};
