import { axiosClient } from "./axiosClient";

const workspacesRoute = "/workspaces";
const favoritesRoute = "/favorites";
const boardsRoute = "/boards";

export const favoritesApi = {
    async getMyFavorites() {
        try {
            return await axiosClient.get(`${favoritesRoute}`);
        } catch (err) {
            return err.response;
        }
    },
    async toggleStarWorkspace(workspaceId) {
        try {
            return await axiosClient.post(`${favoritesRoute}${workspacesRoute}/${workspaceId}`);
        } catch (err) {
            return err.response;
        }
    },
    async toggleStarBoard(boardId) {
        try {
            return await axiosClient.post(`${favoritesRoute}${boardsRoute}/${boardId}`);
        } catch (err) {
            return err.response;
        }
    }
};
