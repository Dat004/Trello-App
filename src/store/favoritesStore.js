import { create } from "zustand";

const useFavoritesStore = create((set) => ({
    favoriteWorkspaces: [],
    favoriteBoards: [],
    loading: true,

    setFavorites: (data) =>
        set({
            favoriteWorkspaces: data.workspaces || [],
            favoriteBoards: data.boards || [],
            loading: false,
        }),

    toggleWorkspaceFavorite: (workspaceId) =>
        set((state) => ({
            favoriteWorkspaces: state.favoriteWorkspaces.includes(workspaceId)
                ? state.favoriteWorkspaces.filter((id) => id !== workspaceId)
                : [...state.favoriteWorkspaces, workspaceId],
        })),

    toggleBoardFavorite: (boardId) =>
        set((state) => ({
            favoriteBoards: state.favoriteBoards.includes(boardId)
                ? state.favoriteBoards.filter((id) => id !== boardId)
                : [...state.favoriteBoards, boardId],
        })),

    clearFavorites: () =>
        set({
            favoriteWorkspaces: [],
            favoriteBoards: [],
            loading: false,
        }),
}));

export default useFavoritesStore;
