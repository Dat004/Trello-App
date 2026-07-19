import { axiosClient } from "./axiosClient";

const activitiesRoute = "/activities";
const workspaceRoute = "/workspace";
const boardRoute = "/board";

export const activitiesApi = {
    async getActivitiesInWorkspace(workspaceId, params) {
        return await axiosClient.get(`${activitiesRoute}${workspaceRoute}/${workspaceId}`, { params });
    },
    async getActivitiesInBoard(boardId, params) {
        return await axiosClient.get(`${activitiesRoute}${boardRoute}/${boardId}`, { params });
    },
    async getMyActivities(params) {
        return await axiosClient.get(`${activitiesRoute}/me`, { params });
    }
}
