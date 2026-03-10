import { axiosClient } from "./axiosClient";

const aiRoute = '/ai';

export const aiApi = {
    async generateTemplate(data) {
        try {
            return await axiosClient.post(`${aiRoute}/generate-template`, data);
        } catch (err) {
            return err.response;
        }
    },
    async analyzeBoard(boardId, payload) {
        try {
            return await axiosClient.post(`${aiRoute}/boards/${boardId}/analyze`, payload);
        } catch (err) {
            return err.response;
        }
    }
};
