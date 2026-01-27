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
}));

export default useFavoritesStore;
