import { boardApi } from "@/api/board";
import { useQuery } from "@tanstack/react-query";

export const BOARD_KEYS = {
    all: ['boards'],
    detail: (id) => ['board', id],
    list: (workspaceId) => ['workspace-boards', workspaceId]
};

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
