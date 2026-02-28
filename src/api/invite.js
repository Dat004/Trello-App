import { axiosClient } from "./axiosClient";

const entityRoute = (entityType, entityId) => {
    if (entityType === "workspace") return `/workspaces/${entityId}`;
    if (entityType === "board") return `/boards/${entityId}`;
    throw new Error(`Unknown entityType: ${entityType}`);
};

export const inviteApi = {
    async sendInvite(entityType, entityId, data) {
        try {
            return await axiosClient.post(`${entityRoute(entityType, entityId)}/invite`, data);
        } catch (err) {
            return err.response;
        }
    },
    async respondInvite(entityType, entityId, data) {
        try {
            return await axiosClient.patch(`${entityRoute(entityType, entityId)}/invite`, data);
        } catch (err) {
            return err.response;
        }
    },
};
