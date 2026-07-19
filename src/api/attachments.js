import { axiosClient } from "./axiosClient";

const attachmentsRoute = "/attachments";
const boardsRoute = "/boards";
const cardsRoute = "/cards";

export const attachmentsApi = {
    async getAttachmentsByCardId(boardId, cardId, limit = 10, skip = 0) {
        return await axiosClient.get(`${boardsRoute}/${boardId}${cardsRoute}/${cardId}${attachmentsRoute}`, {
            params: {
                limit,
                skip,
            },
        });
    },
    async addAttachment(boardId, cardId, data) {
        return await axiosClient.post(`${boardsRoute}/${boardId}${cardsRoute}/${cardId}${attachmentsRoute}/create`, data);
    },
    async deleteAttachment(boardId, cardId, attachmentId, data) {
        return await axiosClient.delete(`${boardsRoute}/${boardId}${cardsRoute}/${cardId}${attachmentsRoute}/${attachmentId}`, {
            data: data || {},
        });
    },
};
