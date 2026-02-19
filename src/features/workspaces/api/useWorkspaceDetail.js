import { workspaceApi } from "@/api/workspace";
import { useQuery } from "@tanstack/react-query";

// Constants for Query Keys
export const WORKSPACE_KEYS = {
    all: ['workspaces'],
    detail: (id) => ['workspace', id],
};

export function useWorkspaceDetail(workspaceId) {
    return useQuery({
        queryKey: WORKSPACE_KEYS.detail(workspaceId),
        queryFn: async () => {
            const response = await workspaceApi.getWorkspaceById(workspaceId);
            // Giả sử response success trả về data.data.workspace
            // Cần check structure API response
            if (!response.data?.success) {
                throw new Error(response.data?.message || 'Failed to fetch workspace');
            }
            return response.data.data; // Return full data object (workspace, is_member, etc)
        },
        enabled: !!workspaceId, // Only fetch if ID exists
        staleTime: 1000 * 60 * 5, // Cache for 5 minutes
        retry: 1,
    });
}
