import { axiosClient } from "./axiosClient";

const popularTemplatesRoute = "/popular";
const templatesRoute = "/templates";
const useTemplateRoute = "/use";

export const templatesApi = {
    async getAllTemplates() {
        try {
            return await axiosClient.get(templatesRoute);
        } catch (error) {
            return error.response;
        }
    },
    async getPopularTemplates() {
        try {
            return await axiosClient.get(`${templatesRoute}${popularTemplatesRoute}`);
        } catch (error) {
            return error.response;
        }
    },
    async createBoardFromTemplate(templateId, data) {
        try {
            return await axiosClient.post(`${templatesRoute}/${templateId}${useTemplateRoute}`, data);
        } catch (error) {
            return error.response;
        }
    }
};
