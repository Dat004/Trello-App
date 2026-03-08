import { axiosClient } from "./axiosClient";

const aiRoute = '/ai';

export const aiApi = {
    async generateTemplate(data) {
        try {
            return await axiosClient.post(`${aiRoute}/generate-template`, data);
        } catch (err) {
            return err.response;
        }
    }
};
