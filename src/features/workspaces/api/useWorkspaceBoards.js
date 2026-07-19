import { boardApi } from "@/api/board";
import { BOARD_KEYS } from "@/query/queryKeys";
import { useQuery } from "@tanstack/react-query";

export { BOARD_KEYS };

export function useWorkspaceBoards(workspaceId) {
    return useQuery({
        queryKey: BOARD_KEYS.list(workspaceId),
        queryFn: async () => {
            const response = await boardApi.getBoardsInWorkspace(workspaceId);
            if (!response.data?.success) {
                throw new Error(response.data?.message || 'Failed to fetch boards');
            }
            return response.data.data.boards;
        },
        enabled: !!workspaceId,
        staleTime: 1000 * 60 * 5, // 5 mins
    });
}
