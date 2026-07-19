import { axiosClient } from "./axiosClient";

const workspacesRoute = "/workspaces";
const favoritesRoute = "/favorites";
const boardsRoute = "/boards";

export const favoritesApi = {
    async getMyFavorites() {
        return await axiosClient.get(`${favoritesRoute}`);
    },
    async toggleStarWorkspace(workspaceId) {
        return await axiosClient.patch(`${favoritesRoute}${workspacesRoute}/${workspaceId}`);
    },
    async toggleStarBoard(boardId) {
        return await axiosClient.patch(`${favoritesRoute}${boardsRoute}/${boardId}`);
    }
};
