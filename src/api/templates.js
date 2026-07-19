import { axiosClient } from "./axiosClient";

const popularTemplatesRoute = "/popular";
const templatesRoute = "/templates";
const useTemplateRoute = "/use";

export const templatesApi = {
    async getAllTemplates() {
        return await axiosClient.get(templatesRoute);
    },
    async getPopularTemplates() {
        return await axiosClient.get(`${templatesRoute}${popularTemplatesRoute}`);
    },
    async createBoardFromTemplate(templateId, data) {
        return await axiosClient.post(`${templatesRoute}/${templateId}${useTemplateRoute}`, data);
    }
};
