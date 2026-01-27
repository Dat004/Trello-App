import { useEffect } from "react";

import { useAuthStore, useFavoritesStore } from "@/store";
import { favoritesApi } from "@/api/favorites";
import useApiMutation from "./useApiMutation";

export const useFavoritesInit = () => {
    const setFavorites = useFavoritesStore((s) => s.setFavorites);
    const clearFavorites = useFavoritesStore((s) => s.clearFavorites);
    const user = useAuthStore((s) => s.user);

    useEffect(() => {
        if (!user) return;

        const fetchFavorites = async () => {
            try {
                const res = await favoritesApi.getMyFavorites();

                if (res.data?.success) {
                    setFavorites(res.data.data);
                    return;
                }

                clearFavorites();
            } catch {
                clearFavorites();
            }
        };

        fetchFavorites();
    }, [user]);
}

export const useFavorites = () => {
    const toggleWorkspaceFavorite = useFavoritesStore((s) => s.toggleWorkspaceFavorite);
    const toggleBoardFavorite = useFavoritesStore((s) => s.toggleBoardFavorite);

    // Toggle star cho workspace
    const { mutate: toggleWorkspaceStarMutation, isLoading: isTogglingWorkspace } = useApiMutation(
        (workspaceId) => favoritesApi.toggleStarWorkspace(workspaceId)
    );

    // Toggle star cho board
    const { mutate: toggleBoardStarMutation, isLoading: isTogglingBoard } = useApiMutation(
        (boardId) => favoritesApi.toggleStarBoard(boardId)
    );

    const toggleWorkspaceStar = async (workspace) => {
        const result = await toggleWorkspaceStarMutation(workspace._id);
        
        if (result.success) {
            toggleWorkspaceFavorite({
                _id: workspace._id,
                name: workspace.name,
                description: workspace.description,
                color: workspace.color,
            });
        }
        
        return result;
    };

    const toggleBoardStar = async (board) => {
        const result = await toggleBoardStarMutation(board._id);
        
        if (result.success) {
            toggleBoardFavorite({
                _id: board._id,
                title: board.title,
                description: board.description,
                color: board.color,
                workspace: board.workspace,
            });
        }
        
        return result;
    };

    return {
        toggleWorkspaceStar,
        toggleBoardStar,
        isTogglingWorkspace,
        isTogglingBoard,
    };
};
