import { axiosClient } from "./axiosClient";

const entityRoute = (entityType, entityId) => {
    if (entityType === "workspace") return `/workspaces/${entityId}`;
    if (entityType === "board") return `/boards/${entityId}`;
    throw new Error(`Unknown entityType: ${entityType}`);
};

export const inviteApi = {
    async sendInvite(entityType, entityId, data) {
        return await axiosClient.post(`${entityRoute(entityType, entityId)}/invite`, data);
    },
    async respondInvite(entityType, entityId, data) {
        return await axiosClient.patch(`${entityRoute(entityType, entityId)}/invite`, data);
    },
};
