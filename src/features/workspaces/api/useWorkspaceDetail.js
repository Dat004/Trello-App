import { workspaceApi } from "@/api/workspace";
import { WORKSPACE_KEYS } from "@/query/queryKeys";
import { unwrapApiData } from "@/utils/apiError";
import { useQuery } from "@tanstack/react-query";

export { WORKSPACE_KEYS };

export function useWorkspaceDetail(workspaceId) {
    return useQuery({
        queryKey: WORKSPACE_KEYS.detail(workspaceId),
        queryFn: async () => {
            const response = await workspaceApi.getWorkspaceById(workspaceId);
            return unwrapApiData(response, "Failed to fetch workspace");
        },
        enabled: !!workspaceId, // Only fetch if ID exists
        staleTime: 1000 * 60 * 5, // Cache for 5 minutes
        retry: 1,
    });
}
