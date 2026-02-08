import { create } from "zustand";

const useFavoritesStore = create((set) => ({
    favoriteWorkspaces: [],
    favoriteBoards: [],
    loading: true,

    setFavorites: (data) =>
        set({
            favoriteWorkspaces: data.starred_workspaces || [],
            favoriteBoards: data.starred_boards || [],
            loading: false,
        }),

    toggleWorkspaceFavorite: (workspace) =>
        set((state) => {
            const exists = state.favoriteWorkspaces.some(ws => ws._id === workspace._id);

            return {
                favoriteWorkspaces: exists
                    ? state.favoriteWorkspaces.filter((ws) => ws._id !== workspace._id)
                    : [...state.favoriteWorkspaces, workspace],
            };
        }),

    toggleBoardFavorite: (board) =>
        set((state) => {
            const exists = state.favoriteBoards.some(b => b._id === board._id);

            return {
                favoriteBoards: exists
                    ? state.favoriteBoards.filter((b) => b._id !== board._id)
                    : [...state.favoriteBoards, board],
            };
        }),

    clearFavorites: () =>
        set({
            favoriteWorkspaces: [],
            favoriteBoards: [],
            loading: false,
        }),

    // Real-time sync methods
    syncFavoriteWorkspace: (workspace) =>
        set((state) => ({
            favoriteWorkspaces: state.favoriteWorkspaces.map(ws =>
                ws._id === workspace._id ? { ...ws, ...workspace } : ws
            )
        })),

    removeFavoriteWorkspace: (workspaceId) =>
        set((state) => ({
            favoriteWorkspaces: state.favoriteWorkspaces.filter(ws => ws._id !== workspaceId)
        })),

    syncFavoriteBoard: (board) =>
        set((state) => ({
            favoriteBoards: state.favoriteBoards.map(b =>
                b._id === board._id ? { ...b, ...board } : b
            )
        })),

    removeFavoriteBoard: (boardId) =>
        set((state) => ({
            favoriteBoards: state.favoriteBoards.filter(b => b._id !== boardId)
        })),
}));

export default useFavoritesStore;
