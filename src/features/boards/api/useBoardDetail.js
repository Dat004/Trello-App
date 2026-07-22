import { boardApi } from '@/api/board';
import { BOARD_KEYS } from '@/query/queryKeys';
import { boardDetailContract } from '@/schemas/apiContracts';
import { useQuery } from '@tanstack/react-query';

export { BOARD_KEYS };

export const useBoardDetail = (boardId) => {
    return useQuery({
        queryKey: BOARD_KEYS.detail(boardId),
        queryFn: async () => {
            const res = await boardApi.detailBoard(boardId);

            if (!res.data?.success) {
                const error = new Error(res.data?.message || 'Không thể tải thông tin bảng');
                error.status = res.status;
                error.response = res.data;
                throw error;
            }

            const parsed = boardDetailContract.safeParse(res.data.data);
            if (!parsed.success) {
                throw new Error('Phản hồi bảng không hợp lệ');
            }

            return parsed.data;
        },
        enabled: !!boardId,
        staleTime: 1000 * 60 * 5,
        retry: (failureCount, error) => {
            if (error.status === 403 || error.status === 404) return false;
            return failureCount < 2;
        }
    });
};
