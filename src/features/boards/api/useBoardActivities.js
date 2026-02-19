import { activitiesApi } from "@/api/activities";
import { useInfiniteQuery } from "@tanstack/react-query";

export const BOARD_ACTIVITIES_KEYS = {
    list: (boardId) => ['board-activities', boardId],
};

export function useBoardActivities(boardId, options = {}) {
    const query = useInfiniteQuery({
        queryKey: BOARD_ACTIVITIES_KEYS.list(boardId),
        queryFn: async ({ pageParam = 0 }) => {
            const res = await activitiesApi.getActivitiesInBoard(boardId, { skip: pageParam });
            if (!res.data?.success) throw new Error(res.data?.message || 'Failed to fetch activities');
            return res.data.data;
        },
        getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.nextSkip : undefined,
        enabled: !!boardId && (options.enabled !== false), // Default true unless explicitly false
        staleTime: 1000 * 60,
        ...options // Allow overrides
    });

    const activities = query.data?.pages.flatMap(page => page.activities) || [];
    // Calculate total from last page or accumulate? Usually backend returns total in metadata
    const total = query.data?.pages?.[0]?.total || 0;

    return {
        ...query,
        activities,
        total,
        loadMore: query.fetchNextPage,
        hasMore: query.hasNextPage,
        loading: query.isFetching,
    };
}
