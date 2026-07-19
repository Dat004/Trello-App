import { axiosClient } from "./axiosClient";

const aiRoute = '/ai';

export const aiApi = {
    async generateTemplate(data) {
        return await axiosClient.post(`${aiRoute}/generate-template`, data);
    },
    async analyzeBoard(boardId, payload) {
        return await axiosClient.post(`${aiRoute}/boards/${boardId}/analyze`, payload);
    }
};
