import { activitiesApi } from "@/api/activities";
import { useInfiniteQuery } from "@tanstack/react-query";

export const WORKSPACE_ACTIVITIES_KEYS = {
    list: (workspaceId) => ['workspace-activities', workspaceId],
};

export function useWorkspaceActivities(workspaceId) {
    const query = useInfiniteQuery({
        queryKey: WORKSPACE_ACTIVITIES_KEYS.list(workspaceId),
        queryFn: async ({ pageParam = 0 }) => {
            const res = await activitiesApi.getActivitiesInWorkspace(workspaceId, { skip: pageParam });
            if (!res.data?.success) throw new Error(res.data?.message || 'Failed to fetch activities');
            return res.data.data;
        },
        getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.nextSkip : undefined,
        enabled: !!workspaceId,
        staleTime: 1000 * 60,
    });

    const activities = query.data?.pages.flatMap(page => page.activities) || [];

    return {
        ...query,
        activities,
        loadMore: query.fetchNextPage,
        hasMore: query.hasNextPage,
        loading: query.isFetching,
    };
}
