import { axiosClient } from "./axiosClient";

const activitiesRoute = "/activities";
const workspaceRoute = "/workspace";
const boardRoute = "/board";

export const activitiesApi = {
    async getActivitiesInWorkspace(workspaceId, params) {
        try {
            return await axiosClient.get(`${activitiesRoute}${workspaceRoute}/${workspaceId}`, { params });
        } catch (err) {
            return err.response;
        }
    },
    async getActivitiesInBoard(boardId, params) {
        try {
            return await axiosClient.get(`${activitiesRoute}${boardRoute}/${boardId}`, { params });
        } catch (err) {
            return err.response;
        }
    }
}
