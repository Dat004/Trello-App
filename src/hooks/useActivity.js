import { useEffect, useState } from "react";

import { activitiesApi } from "@/api/activities";
import { useActivityStore } from "@/store";

export const useWorkspaceActivities = (workspaceId) => {
    const [loading, setLoading] = useState(false);

    // ✅ Get full data object với pagination metadata
    const data = useActivityStore(
        (state) => state.workspaceActivities[workspaceId],
        (a, b) => a === b // Shallow equality
    ) || { activities: [], hasMore: false, nextSkip: 0, total: 0 };

    const setActivities = useActivityStore((state) => state.setWorkspaceActivities);
    const clearActivities = useActivityStore((state) => state.clearWorkspaceActivities);

    useEffect(() => {
        if (!workspaceId) return;

        // Bỏ qua nếu đã có dữ liệu
        if (data.activities.length > 0) return;

        const fetchActivities = async () => {
            setLoading(true);

            try {
                const res = await activitiesApi.getActivitiesInWorkspace(workspaceId);

                if (res.data?.success) {
                    setActivities(workspaceId, res.data.data);
                } else {
                    console.error(res.data?.message);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchActivities();
    }, [workspaceId, setActivities]);

    // Load more với nextSkip
    const loadMore = async () => {
        if (!data.hasMore || loading) return;

        setLoading(true);

        try {
            const res = await activitiesApi.getActivitiesInWorkspace(workspaceId, {
                skip: data.nextSkip,
            });

            if (res.data?.success) {
                setActivities(workspaceId, res.data.data, true);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Refresh/refetch
    const refresh = async () => {
        if (!workspaceId) return;

        setLoading(true);

        try {
            const res = await activitiesApi.getActivitiesInWorkspace(workspaceId);

            if (res.data?.success) {
                setActivities(workspaceId, res.data.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return {
        activities: data.activities,
        hasMore: data.hasMore,
        total: data.total,
        loading,
        loadMore,
        refresh,
    };
};

export const useBoardActivities = (boardId) => {
    const [loading, setLoading] = useState(false);

    // ✅ Get full data object với pagination metadata
    const data = useActivityStore(
        (state) => state.boardActivities[boardId],
        (a, b) => a === b // Shallow equality
    ) || { activities: [], hasMore: false, nextSkip: 0, total: 0 };

    const setActivities = useActivityStore((state) => state.setBoardActivities);
    const clearActivities = useActivityStore((state) => state.clearBoardActivities);

    useEffect(() => {
        if (!boardId) return;

        // Bỏ qua nếu đã có dữ liệu
        if (data.activities.length > 0) return;

        const fetchActivities = async () => {
            setLoading(true);

            try {
                const res = await activitiesApi.getActivitiesInBoard(boardId);

                if (res.data?.success) {
                    setActivities(boardId, res.data.data);
                } else {
                    console.error(res.data?.message);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchActivities();
    }, [boardId, setActivities]);

    // Load more với nextSkip
    const loadMore = async () => {
        if (!data.hasMore || loading) return;

        setLoading(true);

        try {
            const res = await activitiesApi.getActivitiesInBoard(boardId, {
                skip: data.nextSkip,
            });

            if (res.data?.success) {
                setActivities(boardId, res.data.data, true);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Refresh/refetch
    const refresh = async () => {
        if (!boardId) return;

        setLoading(true);

        try {
            const res = await activitiesApi.getActivitiesInBoard(boardId);

            if (res.data?.success) {
                setActivities(boardId, res.data.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return {
        activities: data.activities,
        hasMore: data.hasMore,
        total: data.total,
        loading,
        loadMore,
        refresh,
    };
};
