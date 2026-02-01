import { create } from "zustand";

const useActivityStore = create((set) => ({
    // States
    workspaceActivities: {}, // Map data by workspaceId: { activities: [], hasMore: bool, nextSkip: number, total: number }
    boardActivities: {},     // Map data by boardId: { activities: [], hasMore: bool, nextSkip: number, total: number }

    // Actions
    // Workspace Activities
    setWorkspaceActivities: (workspaceId, data, shouldAppend = false) =>
        set((state) => {
            const currentData = state.workspaceActivities[workspaceId] || { activities: [], hasMore: false, nextSkip: 0, total: 0 };

            return {
                workspaceActivities: {
                    ...state.workspaceActivities,
                    [workspaceId]: {
                        activities: shouldAppend
                            ? [...currentData.activities, ...data.activities]
                            : data.activities,
                        hasMore: data.hasMore,
                        nextSkip: data.nextSkip,
                        total: data.total,
                    },
                },
            };
        }),

    addWorkspaceActivity: (workspaceId, activity) =>
        set((state) => {
            const currentData = state.workspaceActivities[workspaceId] || { activities: [], hasMore: false, nextSkip: 0, total: 0 };

            return {
                workspaceActivities: {
                    ...state.workspaceActivities,
                    [workspaceId]: {
                        ...currentData,
                        activities: [activity, ...currentData.activities],
                        total: currentData.total + 1,
                    },
                },
            };
        }),

    clearWorkspaceActivities: (workspaceId) =>
        set((state) => {
            const newWorkspaceActivities = { ...state.workspaceActivities };
            delete newWorkspaceActivities[workspaceId];

            return {
                workspaceActivities: newWorkspaceActivities,
            };
        }),

    // Board Activities
    setBoardActivities: (boardId, data, shouldAppend = false) =>
        set((state) => {
            const currentData = state.boardActivities[boardId] || { activities: [], hasMore: false, nextSkip: 0, total: 0 };

            return {
                boardActivities: {
                    ...state.boardActivities,
                    [boardId]: {
                        activities: shouldAppend
                            ? [...currentData.activities, ...data.activities]
                            : data.activities,
                        hasMore: data.hasMore,
                        nextSkip: data.nextSkip,
                        total: data.total,
                    },
                },
            };
        }),

    addBoardActivity: (boardId, activity) =>
        set((state) => {
            const currentData = state.boardActivities[boardId] || { activities: [], hasMore: false, nextSkip: 0, total: 0 };

            return {
                boardActivities: {
                    ...state.boardActivities,
                    [boardId]: {
                        ...currentData,
                        activities: [activity, ...currentData.activities],
                        total: currentData.total + 1,
                    },
                },
            };
        }),

    clearBoardActivities: (boardId) =>
        set((state) => {
            const newBoardActivities = { ...state.boardActivities };
            delete newBoardActivities[boardId];

            return {
                boardActivities: newBoardActivities,
            };
        }),

    clearAllActivities: () =>
        set(() => ({
            workspaceActivities: {},
            boardActivities: {},
        })),
}));

export default useActivityStore;
